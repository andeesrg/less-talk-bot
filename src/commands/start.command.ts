import { controlTasksButtons } from "@buttons";
import { dbService } from "@services";

import { Command } from "@commands";

export class StartCommand extends Command {
	handle(): void {
		this.bot.start(async ctx => {
			ctx.session.chatId = ctx.message.chat.id;
			const { userName } = await dbService.initUser(
				ctx.message.chat.id,
				ctx.message.from.first_name
			);
			await ctx.replyWithHTML(
				`Hello <b>${userName}</b> and welcome to LessTalkBot👋🏼\n\n<i>See what this bot can do</i>, <b>use</b> /help`,
				controlTasksButtons()
			);
		});
	}
}
