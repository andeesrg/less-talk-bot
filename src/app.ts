import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { ConfigService, IConfigService } from '@config';
import { Command, StartCommand, ClearCommand, HelpCommand } from '@commands';
import { IBotContext } from '@context';

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get('BOT_TOKEN'));
		this.bot.use(
			new LocalSession({ database: 'sessions.json' }).middleware()
		);
	}

	init() {
		this.commands = [
			new StartCommand(this.bot),
			new ClearCommand(this.bot),
			new HelpCommand(this.bot),
		];
		for (const command of this.commands) {
			command.handle();
		}
		this.bot.launch();
	}
}

const bot = new Bot(new ConfigService());

bot.init();
