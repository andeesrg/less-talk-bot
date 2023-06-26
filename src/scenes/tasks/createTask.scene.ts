import { taskTitleRegex } from "@constants";
import { IBotContext } from "@context";
import { dbService } from "@services";
import { Composer, Scenes } from "telegraf";

const taskTitleHandler = new Composer<IBotContext>();

const enterTaskHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2(
		"Enter your task title✍🏼, _use only letters_ "
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskTitleHandler.hears(taskTitleRegex, async ctx => {
	await dbService.createTask(ctx.session.chatId, ctx.message.text);
	await ctx.replyWithMarkdownV2(`Task: *${ctx.message.text}* is added☑️`);
	ctx.scene.leave();
});

export const createTask = new Scenes.WizardScene<IBotContext>(
	"createTask",
	enterTaskHandler,
	taskTitleHandler
);