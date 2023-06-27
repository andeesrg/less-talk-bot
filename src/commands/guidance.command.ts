import { Command } from "@commands";
import { IBotContext } from "@context";
import { Telegraf } from "telegraf";

export class GuidanceCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.command("guidance", ctx => ctx.scene.enter("guidance"));
	}
}
