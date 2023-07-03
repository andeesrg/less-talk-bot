import { Command } from "@commands";
import { commands } from "@constants";
import { IBotContext } from "@interfaces";
import { Telegraf } from "telegraf";

export class HelpCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.help(async ctx => {
			await ctx.reply(
				`Here's the list of supported commands⬇️\n\n${commands
					.map(({ command, description }) => `${command} - ${description}\n`)
					.join("")}`
			);
		});
	}
}
