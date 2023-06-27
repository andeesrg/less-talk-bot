import {
	CatCommand,
	Command,
	DogCommand,
	GuidanceCommand,
	HelpCommand,
	StartCommand,
	WeatherCommand,
} from "@commands";
import { ConfigService, IConfigService } from "@config";
import { tasks as taskActions, unsub } from "@constants/actions";
import { commands } from "@constants/commands";
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
import { Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

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

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
		this.bot.use(
			new LocalSession<IBotContext>({
				database: "sessions.json",
			}).middleware()
		);
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

const bot = new Bot(new ConfigService());

(async () => {
	await dbService.connectToDB();
	bot.initCommands();
	bot.initTasksListener();
	bot.initUnsubListener();
	bot.init();
})();
