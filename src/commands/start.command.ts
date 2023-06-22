import { Command } from "@commands";
import { IBotContext } from "@context";
import { dbService } from "@services";
import { Telegraf } from "telegraf";

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.start(async ctx => {
			ctx.session.chatId = ctx.message.chat.id;
			const { userName } = await dbService.setUser(
				ctx.message.chat.id,
				ctx.message.from.first_name
			);
			await ctx.replyWithMarkdownV2(
				`Hello *${userName}* and welcome to LessTalk Bot👋🏼\n\n_See what this bot can do,_ *use* /help`
			);
		});
	}
}
