import { Command } from "@commands";
import { commands } from "@constants";
import { IBotContext } from "@context";
import { Telegraf } from "telegraf";

export class HelpCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.help(ctx => {
			ctx.reply(
				`Here's the list of supported commands⬇️\n\n${commands
					.map(
						({ name, description, emoji }) =>
							`${name} - ${description}${emoji}\n`
					)
					.join("")}`
			);
		});
	}
}
