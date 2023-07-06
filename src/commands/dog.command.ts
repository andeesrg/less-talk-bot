import { Command } from "./command.class";

export class DogCommand extends Command {
	handle(): void {
		this.bot.command("dog", async ctx => {
			await ctx.scene.enter("dog");
		});
	}
}
