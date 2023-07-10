import { Command } from "./command.class";

export class CatCommand extends Command {
	handle(): void {
		this.bot.command("cat", async ctx => {
			await ctx.scene.enter("cat");
		});
	}
}
