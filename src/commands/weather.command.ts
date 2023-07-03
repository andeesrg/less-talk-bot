import { Telegraf } from "telegraf";
import { Command } from "@commands";
import { IBotContext } from "@interfaces";

export class WeatherCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command("weather", async ctx => {
			ctx.session.chatId = ctx.message.chat.id;
			ctx.scene.enter("weather");
		});
	}
}
