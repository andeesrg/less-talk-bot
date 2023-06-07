import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.start(ctx => {
			ctx.reply('Hello and welcome to the LessTalk Bot!👋🏼');
		});
	}
}
