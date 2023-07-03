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
import { IBotContext } from "@interfaces";
import { extractTime, formWeatherForecast } from "@helpers";
import { SubscribeService } from "@services";
import { weatherService } from "@api";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();
const suggestSubCityHandler = new Composer<IBotContext>();
const subCityHandler = new Composer<IBotContext>();
const newSubCityHandler = new Composer<IBotContext>();
const timeHandler = new Composer<IBotContext>();
const confirmTimeHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("🏙️Enter city in format <b>City</b>");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

cityHandler.hears(cityRegex, async ctx => {
	ctx.scene.session.userLocation = ctx.message.text;
	await ctx.replyWithHTML("☀️<b>Receiving weather...</b>");

	const { data, error } = await weatherService.getCurrWeather(
		ctx.scene.session.userLocation
	);

	if (error) {
		await ctx.reply(error);
		return ctx.scene.leave();
	}

	await ctx.replyWithHTML(formWeatherForecast(data));
	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
cityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithHTML(
			"<b>City</b> is invalid ❌\nEnter city in proper format <b>City</b>"
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
	ctx.session.userSubLocation = "";
	ctx.session.userSubTime = { hours: "", mins: "" };
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
	await ctx.editMessageText("🏙️Enter city in format <b>City</b>", {
		parse_mode: "HTML",
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
		await ctx.replyWithHTML(
			"<b>City</b> is invalid ❌\nEnter city in proper format <b>City</b>"
		);
	}
});

const enterTimeHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML(
		`<b>Enter notification time</b>⌚️\n\nEnter time in format <b>h/hh:mm</b>(7:05)`
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
		await ctx.replyWithHTML(
			"<b>Time</b> is invalid❌\nEnter time in proper format!(e.g. 7:05)"
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
	await subscribe.deactivateSub();
	await subscribe.activateSub(
		ctx.session.chatId,
		ctx.session.userSubLocation,
		ctx.session.userSubTime
	);
	await ctx.replyWithHTML(
		`👀You've subscribed on daily weather forecast in <b>${ctx.session.userSubLocation.toUpperCase()}!</b>`
	);
	return ctx.scene.leave();
});
confirmTimeHandler.action(editTime.action, async ctx => {
	await ctx.replyWithHTML("Enter time in format <b>h/hh:mm</b>⌚️");
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
