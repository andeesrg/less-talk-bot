import {
	CatCommand,
	ClearCommand,
	Command,
	DogCommand,
	HelpCommand,
	StartCommand,
	WeatherCommand,
} from "@commands";
import { ConfigService, IConfigService } from "@config";
import { IBotContext } from "@context";
import { cat, dog, weather } from "@scenes";
import { dbService } from "@services";
import { Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	stage = new Scenes.Stage<IBotContext>([weather, cat, dog]);

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
		this.bot.use(
			new LocalSession<IBotContext>({
				database: "sessions.json",
			}).middleware()
		);
		this.bot.use(this.stage.middleware());
	}

	init() {
		this.commands = [
			new StartCommand(this.bot),
			new ClearCommand(this.bot),
			new HelpCommand(this.bot),
			new WeatherCommand(this.bot),
			new CatCommand(this.bot),
			new DogCommand(this.bot),
		];
		for (const command of this.commands) {
			command.handle();
		}
		this.bot.launch();
	}
}

const bot = new Bot(new ConfigService());

bot.init();
dbService.connectToDB()
