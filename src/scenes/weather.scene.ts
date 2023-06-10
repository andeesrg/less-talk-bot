import { Composer, Scenes } from 'telegraf';
import { extractLocation, formWeatherData } from '@helpers';
import { locationRegex } from '@constants/regex';
import { weatherService } from '@services';

const locationHandler = new Composer<Scenes.WizardContext>();

locationHandler.on('text', async ctx => {
	if (locationRegex.test(ctx.message.text)) {
		const userLocation = extractLocation(ctx.message.text);
		if (userLocation) {
			await ctx.reply('Looking for the weather forecast...');
			try {
				const weatherData = await weatherService.getCurrWeather(
					userLocation
				);
				await ctx.replyWithMarkdownV2(await formWeatherData(weatherData));
			} catch (e) {
				await ctx.reply('Oops something went wrong!🙁');
			}
			return await ctx.scene.leave();
		}
	} else {
		await ctx.reply('Wrong format!');
		return await ctx.scene.reenter();
	}
});

export const weather = new Scenes.WizardScene<Scenes.WizardContext>(
	'weather',
	async ctx => {
		await ctx.reply('Enter your location in format "City"');
		return ctx.wizard.next();
	},
	locationHandler
);
