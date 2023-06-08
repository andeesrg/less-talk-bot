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
				await ctx.reply(await formWeatherData(weatherData));
			} catch (e) {
				await ctx.reply('Seems like there`s no such a city!🙁');
				return await ctx.scene.reenter();
			}
		}
	} else {
		return await ctx.scene.reenter();
	}
	return await ctx.scene.leave();
});

export const weather = new Scenes.WizardScene<Scenes.WizardContext>(
	'weather',
	async ctx => {
		await ctx.reply('Enter your location in format "City"');
		return ctx.wizard.next();
	},
	locationHandler
);
