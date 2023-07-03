import { commands } from "@constants";

import { Command } from "./command.class";

export class HelpCommand extends Command {
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
