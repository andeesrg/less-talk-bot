import { taskTitleRegex } from "@constants";
import { IBotContext } from "@context";
import { dbService } from "@services";
import { Composer, Scenes } from "telegraf";

const taskTitleHandler = new Composer<IBotContext>();

const enterTaskHandler = (ctx: IBotContext) => {
	ctx.reply("Enter task title✍🏼");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskTitleHandler.hears(taskTitleRegex, async ctx => {
	await dbService.createTask(ctx.session.chatId, ctx.message.text);
	ctx.reply(`Task is added✅`);
	return ctx.scene.leave();
});
taskTitleHandler.on("text", async ctx => {
	if (!taskTitleRegex.test(ctx.message.text)) {
		await ctx.reply("Title must be at least 5 characters long!");
	}
});

export const createTask = new Scenes.WizardScene<IBotContext>(
	"createTask",
	enterTaskHandler,
	taskTitleHandler
);
