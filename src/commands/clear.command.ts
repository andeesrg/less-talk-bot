import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class ClearCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command('clear', ctx => {
			let k = 0;
			for (let i = 0; i <= 100; i++) {
				k = ctx.message.message_id - i;
				if (k === 0) continue;
				ctx.deleteMessage(k);
			}
		});
	}
}
