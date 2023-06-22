import { confirmButtons, subButtons } from "@buttons";
import { cityRegex, subActions, timeRegex } from "@constants";
import { IBotContext } from "@context";
import { extractCity, extractTime, formWeatherData } from "@helpers";
import { SubscribeService, weatherService } from "@services";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();
const enterTimeHandler = new Composer<IBotContext>();
const timeHandler = new Composer<IBotContext>();
const enterConfirmTimeHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	ctx.replyWithMarkdownV2("🏙️Enter city in format *City*");
	return ctx.wizard.next();
};

cityHandler.hears(cityRegex, async ctx => {
	ctx.session.userLocation = extractCity(ctx.message.text);
	ctx.reply("☀️Receiving weather...");
	try {
		const data = await weatherService.getCurrWeather(
			ctx.session.userLocation
		);
		await ctx.replyWithMarkdownV2(formWeatherData(data));
	} catch {
		await ctx.reply("Oops something went wrong🤕!Try again later");
		return ctx.scene.leave();
	}
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
cityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithMarkdownV2(
			"*City* is invalid ❌\nEnter city in proper format *City*"
		);
	}
});

const suggestSubHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2(
		"☀️*Would you like to receive daily weather forecast\\?*",
		subButtons()
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

enterTimeHandler.action(subActions.sub.action, async ctx => {
	await ctx.editMessageText(
		`*Enter notification time*⌚️\n\nEnter time in format *h/hh:mm*`,
		{ parse_mode: "MarkdownV2" }
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
enterTimeHandler.action(subActions.dontSub.action, async ctx => {
	await ctx.deleteMessage();
	return ctx.scene.leave();
});

timeHandler.hears(timeRegex, async ctx => {
	ctx.session.userSubTime = extractTime(ctx.message.text);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
timeHandler.on("text", async ctx => {
	if (!timeRegex.test(ctx.message.text)) {
		await ctx.replyWithMarkdownV2(
			"*Time* is invalid❌\\!\nEnter time in proper format\\!(e.g. 7:00)"
		);
	}
});

const confirmTimeHandler = async (ctx: IBotContext) => {
	ctx.replyWithMarkdownV2(`Is this time correct\\?⌚️`, confirmButtons());

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

enterConfirmTimeHandler.action(subActions.confirmTime.action, async ctx => {
	await ctx.deleteMessage();
	const subscribe = new SubscribeService(ctx.session.chatId);
	await subscribe.activateSub();
	ctx.reply(
		`👀You've subscribed on daily weather forecast at ${ctx.session.userLocation}!`
	);
	return ctx.scene.leave();
});
enterConfirmTimeHandler.action(subActions.editTime.action, async ctx => {
	ctx.replyWithMarkdownV2("Enter time in format *h/hh:mm*⌚️");
	return ctx.wizard.selectStep(4);
});

export const weather = new Scenes.WizardScene<IBotContext>(
	"weather",
	enterCityHandler,
	cityHandler,
	suggestSubHandler,
	enterTimeHandler,
	timeHandler,
	confirmTimeHandler,
	enterConfirmTimeHandler
);
