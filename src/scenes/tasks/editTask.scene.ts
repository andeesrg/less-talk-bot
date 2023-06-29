import { taskEditButtons } from "@buttons";
import { taskEdit, taskIdRegex, taskTitleRegex } from "@constants";
import { IBotContext } from "@context";
import { extractTaskId } from "@helpers/extract";
import { dbService } from "@services";
import { Composer, Scenes } from "telegraf";

const taskIdHandler = new Composer<IBotContext>();
const editTypeHandler = new Composer<IBotContext>();
const resEditTypeHandler = new Composer<IBotContext>();

const enterTaskIdHandler = async (ctx: IBotContext) => {
	await ctx.reply("Enter number of task📀");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskIdHandler.hears(taskIdRegex, async ctx => {
	ctx.scene.session.taskId = extractTaskId(ctx.message.text);
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks?.length) {
		await ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}

	const matchedTask = tasks.find(
		(task: any) => task.id === ctx.scene.session.taskId
	);
	if (!matchedTask) {
		await ctx.reply("Task is not found🤷🏼");

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

const enterEditTypeHandler = async (ctx: IBotContext) => {
	await ctx.reply("Select edit type⬇️", taskEditButtons());

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

editTypeHandler.action(taskEdit.status.action, async ctx => {
	await ctx.editMessageText("Write status in format *done/todo*⬇️", {
		parse_mode: "MarkdownV2",
	});

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
editTypeHandler.action(taskEdit.title.action, async ctx => {
	await ctx.editMessageText("Write new title✍🏼");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});

resEditTypeHandler.hears(/done|todo/gm, async ctx => {
	await dbService.editTask(ctx.session.chatId, {
		id: ctx.scene.session.taskId,
		editType: "status",
		content: ctx.message.text === "done",
	});
	await ctx.replyWithMarkdownV2("Task *status* is changed✅");
	return ctx.scene.leave();
});
resEditTypeHandler.hears(taskTitleRegex, async ctx => {
	await dbService.editTask(ctx.session.chatId, {
		id: ctx.scene.session.taskId,
		editType: "title",
		content: ctx.message.text,
	});
	await ctx.replyWithMarkdownV2("Task *title* is changed✅");
	return ctx.scene.leave();
});

export const editTask = new Scenes.WizardScene<IBotContext>(
	"editTask",
	enterTaskIdHandler,
	taskIdHandler,
	enterEditTypeHandler,
	editTypeHandler,
	resEditTypeHandler
);
