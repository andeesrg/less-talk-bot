import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class CatCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command('cat', ctx => ctx.scene.enter('cat'));
	}
}
