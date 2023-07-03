import { Command } from "@commands";

export class GuidanceCommand extends Command {
	handle(): void {
		this.bot.command("guidance", ctx => ctx.scene.enter("guidance"));
	}
}
