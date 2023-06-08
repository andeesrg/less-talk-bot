import { Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class WeatherCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot); 
	}
	handle(): void {
		this.bot.command('weather', ctx => ctx.scene.enter('weather'));
	}
}
