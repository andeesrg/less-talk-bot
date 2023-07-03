import { Command } from "./command.class";

export class DogCommand extends Command {
	handle(): void {
		this.bot.command("dog", ctx => ctx.scene.enter("dog"));
	}
}
