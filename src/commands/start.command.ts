import { Markup, Telegraf } from 'telegraf';
import { Command } from '@commands';
import { IBotContext } from '@context';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.start(ctx => {
			ctx.reply(
				'Hello and welcome to LessTalk Bot!',
				Markup.inlineKeyboard([
					Markup.button.callback(
						'Get the current weather forecast',
						'weather'
					),
				])
			);
		});

		this.bot.action('weather', ctx => {
			ctx.session.weather = [{ location: 'Gomel', temp: 25 }];
			ctx.reply(
				`${ctx.session.weather.map(
					({ location, temp }) =>
						`City: ${location}\nTemperature: ${temp}C`
				)}`
			);
		});
	}
}
