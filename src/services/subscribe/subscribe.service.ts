import { unsubButton } from "@buttons";
import { tokens } from "@constants";
import { IBotContext } from "@context";
import { formWeatherForecast } from "@helpers";
import { weatherService } from "@services";
import cron from "node-cron";
import { Telegraf } from "telegraf";

export class SubscribeService {
	private bot: Telegraf<IBotContext>;
	private currTask: any;
	private static instance: SubscribeService;

	constructor(private chatIdTerm?: number) {
		this.bot = new Telegraf<IBotContext>(tokens.botToken);
	}

	async deactivateSub() {
		await this.currTask?.stop();
	}

	async activateSub(
		chatId: number,
		location: string,
		time: { hours: string; mins: string }
	) {
		const { hours, mins } = time;
		const utcTime = +hours - 3;
		console.log(`${mins} ${utcTime}, ${chatId}, ${location}`);
		const currTask = cron.schedule(`${mins} ${utcTime} * * *`, async () => {
			const data = await weatherService.getCurrWeather(location);
			new Telegraf(tokens.botToken).telegram.sendMessage(
				chatId,
				formWeatherForecast(data),
				{
					parse_mode: "MarkdownV2",
					...unsubButton(),
				}
			);
		});
		currTask.start();
		this.currTask = currTask;
	}

	static getInstance(chatId?: number) {
		if (!SubscribeService.instance) {
			SubscribeService.instance = new SubscribeService(chatId);
		}

		return SubscribeService.instance;
	}
}
