import { Composer, Markup, Scenes } from 'telegraf';
import { extractLocation, extractTime, formWeatherData } from '@helpers';
import { locationRegex, timeRegex } from '@constants/regex';
import { SubscribeService, weatherService } from '@services';
import { IBotContext } from '@context';

const locationHandler = new Composer<IBotContext>();
const timeHandler = new Composer<IBotContext>();
const answerHandler = new Composer<IBotContext>();

const enterHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2('Enter your location in format "*City*"');
	ctx.session.chatId = ctx.message?.chat.id;
	return ctx.wizard.next();
};

locationHandler.on('text', async ctx => {
	if (!locationRegex.test(ctx.message.text)) {
		await ctx.reply('Wrong format!');
		return await ctx.scene.reenter();
	}

	const userLocation = extractLocation(ctx.message.text);
	ctx.session.userLocation = userLocation;
	ctx.wizard.next();
	if (typeof ctx.wizard.step === 'function') {
		return ctx.wizard.step(ctx, async () => {});
	}
});

const requestHandler = async (ctx: IBotContext) => {
	const userLocation = ctx.session.userLocation;
	await ctx.reply('Looking for the weather forecast...');
	try {
		const weatherData = await weatherService.getCurrWeather(userLocation);
		await ctx.replyWithMarkdownV2(formWeatherData(weatherData));
	} catch {
		await ctx.reply('Oops something went wrong!🙁');
		return await ctx.scene.leave();
	}
	await ctx.replyWithMarkdownV2(
		`What time you'd like to recieve a daily weather forecast?⏰\n\n_Please enter the time in format_  "*h/hh:mm*"`
	);
	ctx.wizard.next();
	if (typeof ctx.wizard.step === 'function') {
		return ctx.wizard.step(ctx, async () => {});
	}
};

timeHandler.on('text', async ctx => {
	if (!timeRegex.test(ctx.message.text)) {
		await ctx.replyWithMarkdownV2(
			`_*Wrong format\\!*_ ❌\n\nEnter hours or mins *without leading 0*`
		);
		return ctx.wizard.selectStep(3);
	}

	const userRemindTime = extractTime(ctx.message.text);
	ctx.session.userRemindTime = userRemindTime;
	ctx.wizard.next();
	if (typeof ctx.wizard.step === 'function') {
		return ctx.wizard.step(ctx, async () => {});
	}
});

const confirmTimeHandler = async (ctx: IBotContext) => {
	await ctx.reply(
		'Is this time correct?',
		Markup.inlineKeyboard([
			Markup.button.callback('✅Yes', 'correctTime'),
			Markup.button.callback('📝No, edit', 'uncorrectTime'),
		])
	);
	ctx.wizard.next();
	if (typeof ctx.wizard.step === 'function') {
		return ctx.wizard.step(ctx, async () => {});
	}
};

answerHandler.action('correctTime', async ctx => {
	await ctx.deleteMessage();
	const subscribe = new SubscribeService();
	subscribe.setReminder();

	return ctx.scene.leave();
});

export const weather = new Scenes.WizardScene<IBotContext>(
	'weather',
	enterHandler,
	locationHandler,
	requestHandler,
	timeHandler,
	confirmTimeHandler,
	answerHandler
);
