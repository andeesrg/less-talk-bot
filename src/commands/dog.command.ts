import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class DogCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command('dog', ctx => ctx.scene.enter('dog'));
	}
}
