import { taskIdRegex } from "@constants";
import { IBotContext } from "@interfaces";
import { dbService } from "@services";
import { Composer, Scenes } from "telegraf";

const taskIdHandler = new Composer<IBotContext>();

const enterTaskIdHandler = async (ctx: IBotContext) => {
	await ctx.reply("Enter number of task📀");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskIdHandler.hears(taskIdRegex, async ctx => {
	ctx.scene.session.taskId = Number(ctx.message.text);
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks?.length) {
		await ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}

	const matchedTask = tasks.find(
		(task: any) => task.id === ctx.scene.session.taskId
	);
	if (!matchedTask) {
		await ctx.reply("Task does not exist🤷🏼");
		return ctx.scene.leave();
	}

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
taskIdHandler.on("text", async ctx => {
	if (!taskIdRegex.test(ctx.message.text)) {
		await ctx.reply("Task number is incorrect❌\nEnter valid task number🔁");
	}
});

const removeTaskHandler = async (ctx: IBotContext) => {
	await dbService.removeTask(ctx.session.chatId, ctx.scene.session.taskId);
	await ctx.reply("Task is removed🧹");
	return ctx.scene.leave();
};

export const removeTask = new Scenes.WizardScene<IBotContext>(
	"removeTask",
	enterTaskIdHandler,
	taskIdHandler,
	removeTaskHandler
);
