import { ConfigService } from "@config";
import { IBotContext } from "@context";
import { formWeatherData, parseDateNow } from "@helpers";
import { sessionService, weatherService } from "@services";
import cron from "node-cron";
import { Telegraf } from "telegraf";
import { ISubParams } from "./sub.interface";

export class SubscribeService {
	bot: Telegraf<IBotContext>;
	private sessionData: ISubParams;

	constructor() {
		this.bot = new Telegraf<IBotContext>(
			new ConfigService().get("BOT_TOKEN")
		);
		this.sessionData = JSON.parse(sessionService.readData());
	}
	async activateSub() {
		const {
			chatId,
			userLocation,
			userSubTime: { hours, mins } = parseDateNow(),
		} = this.sessionData;
		cron.schedule(`${mins} ${hours} * * *`, async () => {
			const data = await weatherService.getCurrWeather(userLocation);
			new Telegraf(
				new ConfigService().get("BOT_TOKEN")
			).telegram.sendMessage(chatId, formWeatherData(data), {
				parse_mode: "MarkdownV2",
			});
		});
	}
}
