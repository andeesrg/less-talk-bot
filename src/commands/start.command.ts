import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.start(async ctx => {
			await ctx.replyWithMarkdownV2(
				`*Hello and welcome to LessTalk Bot*👋🏼\n\n_See what this bot can do,_ *use* /help`
			);
		});
	}
}
