import { Command } from "@commands";

export class GuidanceCommand extends Command {
	handle(): void {
		this.bot.command("guidance", async ctx => {
			await ctx.scene.enter("guidance");
		});
	}
}
