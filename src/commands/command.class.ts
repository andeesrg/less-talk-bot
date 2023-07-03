import { Telegraf } from "telegraf";
import { IBotContext } from "@interfaces";

export abstract class Command {
	constructor(public bot: Telegraf<IBotContext>) {}

	abstract handle(): void;
}
