import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class ClearCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command('clear', async ctx => {
			let i = 0;
			while (true) {
				try {
					await ctx.deleteMessage(ctx.message.message_id - i++);
				} catch (e) {
					break;
				}
			}
		});
	}
}
