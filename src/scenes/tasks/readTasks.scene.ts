import { Scenes } from "telegraf";

import { dbService } from "@services";

import { IBotContext } from "@interfaces";
import { formTasks } from "@helpers";

const requestTasksHandler = async (ctx: IBotContext) => {
	await ctx.reply("Receiving tasks...⌛️");
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks || !tasks?.length) {
		await ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}
	await ctx.reply(formTasks(tasks));
	return ctx.scene.leave();
};

export const readTasks = new Scenes.WizardScene<IBotContext>("readTasks", requestTasksHandler);
