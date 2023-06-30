import {
	CatCommand,
	Command,
	DogCommand,
	GuidanceCommand,
	HelpCommand,
	StartCommand,
	WeatherCommand,
} from "@commands";
import { commands, tasks as taskActions, tokens, unsub } from "@constants";
import { IBotContext } from "@context";
import {
	attractions,
	cat,
	createTask,
	dog,
	editTask,
	events,
	food,
	guidance,
	readTasks,
	removeTask,
	tasks,
	unsubscribe,
	weather,
} from "@scenes";
import { dbService } from "@services";
import { Scenes, Telegraf, session } from "telegraf";

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	stage = new Scenes.Stage<IBotContext>(
		[
			weather,
			cat,
			dog,
			tasks,
			createTask,
			readTasks,
			editTask,
			removeTask,
			unsubscribe,
			guidance,
			attractions,
			events,
			food,
		],
		{ ttl: 120 }
	);

	constructor() {
		this.bot = new Telegraf<IBotContext>(tokens.botToken);
		this.bot.use(session()).middleware();
		this.bot.use(this.stage.middleware());
	}

	async init() {
		this.commands = [
			new StartCommand(this.bot),
			new HelpCommand(this.bot),
			new WeatherCommand(this.bot),
			new CatCommand(this.bot),
			new DogCommand(this.bot),
			new GuidanceCommand(this.bot),
		];
		for (const command of this.commands) {
			command.handle();
		}

		process.once("SIGINT", () => {
			this.bot.stop("SIGINT");
		});

		process.once("SIGTERM", () => {
			this.bot.stop("SIGTERM");
		});

		await this.bot.launch();
	}

	initCommands() {
		this.bot.telegram.setMyCommands(commands);
	}

	initTasksListener() {
		const regex = new RegExp(
			`${taskActions.create.action}|${taskActions.edit.action}|${taskActions.read.action}|${taskActions.remove.action}`
		);
		this.bot.hears(regex, ctx => ctx.scene.enter("tasks"));
	}

	initUnsubListener() {
		this.bot.action(unsub.action, ctx => {
			ctx.scene.enter("unsubscribe");
		});
	}
}

const bot = new Bot();

(async () => {
	await dbService.connectToDB();
	bot.initCommands();
	bot.initTasksListener();
	bot.initUnsubListener();
	bot.init();
})();
