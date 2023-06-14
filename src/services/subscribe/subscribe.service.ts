import { ConfigService } from '@config';
import { IBotContext } from '@context';
import { formWeatherData } from '@helpers';
import { sessionService, weatherService } from '@services';
import cron from 'node-cron';
import { Telegraf } from 'telegraf';

export class SubscribeService {
	private bot: Telegraf<IBotContext>;
	private sessionData: any;

	constructor() {
		this.bot = new Telegraf<IBotContext>(
			new ConfigService().get('BOT_TOKEN')
		);
		this.initSessionData();
	}
	private initSessionData() {
		const sessionData = JSON.parse(sessionService.readData());
		this.sessionData = sessionData;
	}
	setReminder() {
		const {
			chatId,
			userLocation,
			userRemindTime: { hours, mins },
		} = this.sessionData;
		cron.schedule(`${mins} ${hours} * * *`, async () => {
			const data = await weatherService.getCurrWeather(userLocation);
			new Telegraf(
				new ConfigService().get('BOT_TOKEN')
			).telegram.sendMessage(chatId, formWeatherData(data), {
				parse_mode: 'MarkdownV2',
			});
		});
	}
}
