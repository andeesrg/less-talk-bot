import { confirmButtons, subButtons } from "@buttons";
import { actions, locationRegex, timeRegex } from "@constants";
import { IBotContext } from "@context";
import { extractLocation, extractTime, formWeatherData } from "@helpers";
import { SubscribeService, weatherService } from "@services";
import { Composer, Scenes } from "telegraf";

const locationHandler = new Composer<IBotContext>();
const responseSubHandler = new Composer<IBotContext>();
const timeHandler = new Composer<IBotContext>();
const responseConfirmTimeHandler = new Composer<IBotContext>();

const enterHandler = async (ctx: IBotContext) => {
	ctx.replyWithMarkdownV2('Enter city in format "*City*"');
	return ctx.wizard.next();
};

locationHandler.hears(locationRegex, async ctx => {
	ctx.session.userLocation = extractLocation(ctx.message.text);
	ctx.reply("⌛️Wait a second please...");
	try {
		const data = await weatherService.getCurrWeather(
			ctx.session.userLocation
		);
		await ctx.replyWithMarkdownV2(formWeatherData(data));
	} catch (error) {
		await ctx.reply("Oops something went wrong!Try again");
		return ctx.scene.leave();
	}
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
locationHandler.on("text", async ctx => {
	if (!locationRegex.test(ctx.message.text)) {
		ctx.replyWithMarkdownV2(`*Wrong format\\!*`);
	}
});

const suggestSubHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2(
		"*Would you like to sub on a daily WF\\?*",
		subButtons()
	);
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

responseSubHandler.action(actions.sub.action, async ctx => {
	await ctx.editMessageText(
		`*Enter notification time*⌚️\n\nEnter time in format *h/hh:mm*`,
		{ parse_mode: "MarkdownV2" }
	);
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
responseSubHandler.action(actions.dontSub.action, async ctx => {
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
		ctx.replyWithMarkdownV2(`*Wrong format\\!*`);
	}
});

const confirmTimeHandler = async (ctx: IBotContext) => {
	ctx.replyWithMarkdownV2(`Is this time correct?`, confirmButtons());
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

responseConfirmTimeHandler.action(actions.confirmTime.action, async ctx => {
	await ctx.deleteMessage();
	ctx.reply(
		`👀You've successfully subscribed on daily WF at ${ctx.session.userLocation}!`
	);
	const subscribe = new SubscribeService(ctx.session.chatId);
	await subscribe.activateSub();
	return ctx.scene.leave();
});
responseConfirmTimeHandler.action(actions.editTime.action, async ctx => {
	ctx.replyWithMarkdownV2("Enter your new time in format *h/hh:mm*");
	return ctx.wizard.selectStep(4);
});

export const weather = new Scenes.WizardScene<IBotContext>(
	"weather",
	enterHandler,
	locationHandler,
	suggestSubHandler,
	responseSubHandler,
	timeHandler,
	confirmTimeHandler,
	responseConfirmTimeHandler
);
