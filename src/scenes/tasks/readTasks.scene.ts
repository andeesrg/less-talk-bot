import { IBotContext } from "@context";
import { formTasks } from "@helpers";
import { dbService } from "@services";
import { Scenes } from "telegraf";

const requestTasksHandler = async (ctx: IBotContext) => {
	await ctx.reply("Receiving tasks...⌛️");
	const tasks = await dbService.readTasks(ctx.session.chatId);
	await ctx.reply(formTasks(tasks));
	ctx.scene.leave();
};

export const readTasks = new Scenes.WizardScene<IBotContext>(
	"readTasks",
	requestTasksHandler
);
