import { Scenes, session, Telegraf } from "telegraf";

import {
	CatCommand,
	Command,
	DogCommand,
	GuidanceCommand,
	HelpCommand,
	StartCommand,
	WeatherCommand,
} from "@commands";
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
import { IBotContext } from "@interfaces";
import { commands, tasks as taskActions, tokens, unsub } from "@constants";

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
		this.initErrorListeners();
		this.initCommands();
		this.initTasksListener();
		this.initUnsubListener();
	}

	initErrorListeners() {
		process.once("SIGINT", () => {
			this.bot.stop("SIGINT");
		});

		process.once("SIGTERM", () => {
			this.bot.stop("SIGTERM");
		});
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

		await this.bot.launch();
	}

	initCommands() {
		this.bot.telegram.setMyCommands(commands);
	}

	initTasksListener() {
		const regex = new RegExp(
			`${taskActions.create.action}|${taskActions.edit.action}|${taskActions.read.action}|${taskActions.remove.action}`
		);
		this.bot.hears(regex, async ctx => {
			ctx.session.chatId = ctx.message.chat.id;
			await ctx.scene.enter("tasks");
		});
	}

	initUnsubListener() {
		this.bot.action(unsub.action, async ctx => {
			await ctx.scene.enter("unsubscribe");
		});
	}
}

const bot = new Bot();

(async () => {
	await dbService.connectToDb();
	bot.init();
})();
