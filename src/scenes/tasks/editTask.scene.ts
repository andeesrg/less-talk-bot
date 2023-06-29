import { taskEditButtons } from "@buttons";
import { taskEdit, taskIdRegex, taskTitleRegex } from "@constants";
import { IBotContext } from "@context";
import { extractTaskId } from "@helpers/extract";
import { dbService } from "@services";
import { Composer, Scenes } from "telegraf";

const taskIdHandler = new Composer<IBotContext>();
const editTypeHandler = new Composer<IBotContext>();
const resEditTypeHandler = new Composer<IBotContext>();

const enterTaskIdHandler = (ctx: IBotContext) => {
	ctx.reply("Enter number of task📀");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskIdHandler.hears(taskIdRegex, async ctx => {
	ctx.scene.session.taskId = extractTaskId(ctx.message.text);
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks?.length) {
		ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}

	const matchedTask = tasks.find(
		(task: any) => task.id === ctx.scene.session.taskId
	);
	if (!matchedTask) {
		ctx.reply("Task is not found🤷🏼");
		return ctx.wizard.selectStep(1);
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

const enterEditTypeHandler = (ctx: IBotContext) => {
	ctx.reply("Select edit type⬇️", taskEditButtons());

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

editTypeHandler.action(taskEdit.status.action, ctx => {
	ctx.editMessageText("Write status in format *done/todo*⬇️", {
		parse_mode: "MarkdownV2",
	});

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
editTypeHandler.action(taskEdit.title.action, ctx => {
	ctx.editMessageText("Write new title✍🏼");

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
	ctx.replyWithMarkdownV2("Task *status* is changed✅");
	return ctx.scene.leave();
});
resEditTypeHandler.hears(taskTitleRegex, async ctx => {
	await dbService.editTask(ctx.session.chatId, {
		id: ctx.scene.session.taskId,
		editType: "title",
		content: ctx.message.text,
	});
	ctx.replyWithMarkdownV2("Task *title* is changed✅");
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
