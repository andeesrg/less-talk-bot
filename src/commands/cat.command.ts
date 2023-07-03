import { Command } from "./command.class";

export class CatCommand extends Command {
	handle(): void {
		this.bot.command("cat", ctx => ctx.scene.enter("cat"));
	}
}
