import { confirmTimeButtons, subButtons, subCityButtons } from "@buttons";
import {
	cityRegex,
	confirmTime,
	editTime,
	nonSub,
	sub,
	subCity,
	timeRegex,
} from "@constants";
import { IBotContext } from "@context";
import { extractCity, extractTime, formWeatherForecast } from "@helpers";
import { SubscribeService, sessionService, weatherService } from "@services";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();
const suggestSubCityHandler = new Composer<IBotContext>();
const subCityHandler = new Composer<IBotContext>();
const newSubCityHandler = new Composer<IBotContext>();
const timeHandler = new Composer<IBotContext>();
const confirmTimeHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	ctx.replyWithMarkdownV2("🏙️Enter city in format *City*");
	return ctx.wizard.next();
};

cityHandler.hears(cityRegex, async ctx => {
	ctx.scene.session.userLocation = extractCity(ctx.message.text);
	await ctx.reply("☀️Receiving weather...");
	try {
		const data = await weatherService.getCurrWeather(
			ctx.scene.session.userLocation
		);
		await ctx.replyWithMarkdownV2(formWeatherForecast(data));
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
	await ctx.reply(
		"☀️Would you like to receive daily weather forecast?",
		subButtons()
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

suggestSubCityHandler.action(sub.action, async ctx => {
	await ctx.reply(
		"Choose a city you'd like to get weather about🏙️",
		subCityButtons()
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
suggestSubCityHandler.action(nonSub.action, async ctx => {
	await ctx.deleteMessage();
	return ctx.scene.leave();
});

subCityHandler.action(subCity.currCity.action, async ctx => {
	ctx.session.userSubLocation = ctx.scene.session.userLocation;

	ctx.wizard.selectStep(6);
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
subCityHandler.action(subCity.newCity.action, async ctx => {
	await ctx.editMessageText("🏙️Enter city in format *City*", {
		parse_mode: "MarkdownV2",
	});

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});

newSubCityHandler.hears(cityRegex, async ctx => {
	ctx.session.userSubLocation = ctx.message.text;

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
newSubCityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithMarkdownV2(
			"*City* is invalid ❌\nEnter city in proper format *City*"
		);
	}
});

const enterTimeHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2(
		`*Enter notification time*⌚️\n\nEnter time in format *h/hh:mm*\\(7:05\\)`
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

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
			"*Time* is invalid❌\\!\nEnter time in proper format\\!(e.g. 7:05)"
		);
	}
});

const enterConfirmTimeHandler = async (ctx: IBotContext) => {
	await ctx.reply("Is this time correct?⌚️", confirmTimeButtons());

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

confirmTimeHandler.action(confirmTime.action, async ctx => {
	await ctx.deleteMessage();
	const subscribe = SubscribeService.getInstance(ctx.session.chatId);
	const subParams = sessionService.readData(ctx.session.chatId);
	await subscribe.activateSub(subParams);
	await ctx.reply(
		`👀You've subscribed on daily weather forecast in ${ctx.session.userSubLocation}!`
	);
	return ctx.scene.leave();
});
confirmTimeHandler.action(editTime.action, async ctx => {
	await ctx.replyWithMarkdownV2("Enter time in format *h/hh:mm*⌚️");
	return ctx.wizard.selectStep(7);
});

export const weather = new Scenes.WizardScene<IBotContext>(
	"weather",
	enterCityHandler,
	cityHandler,
	suggestSubHandler,
	suggestSubCityHandler,
	subCityHandler,
	newSubCityHandler,
	enterTimeHandler,
	timeHandler,
	enterConfirmTimeHandler,
	confirmTimeHandler
);
