import { Command } from "@commands";

export class WeatherCommand extends Command {
	handle(): void {
		this.bot.command("weather", async ctx => {
			ctx.session.chatId = ctx.message.chat.id;
			ctx.scene.enter("weather");
		});
	}
}
