import { Scenes } from "telegraf";

import { dbService } from "@services";
import { formTasks } from "@helpers";
import { IBotContext } from "@interfaces";

const requestTasksHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("<b>Receiving tasks...</b>⌛️");
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks || !tasks?.length) {
		await ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}
	await ctx.reply(formTasks(tasks));
	return ctx.scene.leave();
};

export const readTasks = new Scenes.WizardScene<IBotContext>("readTasks", requestTasksHandler);
