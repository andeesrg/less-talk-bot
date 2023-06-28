import { cityRegex } from "@constants";
import { IBotContext } from "@context";
import { formEvents } from "@helpers";
import { guidanceService } from "@services/guidance";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2("Enter city in format *City*");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

cityHandler.hears(cityRegex, async ctx => {
	const { data, error } = await guidanceService.getEvents(ctx.message.text);

	if (error) {
		await ctx.reply(error);
		return ctx.scene.leave();
	}

	await ctx.replyWithMarkdownV2("⌛️*Gathering events data\\.\\.\\.*");
	await ctx.replyWithHTML(formEvents(data));

	return ctx.scene.leave();
});
cityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithMarkdownV2(
			"*City* is invalid ❌\nEnter city in proper format *City*"
		);
	}
});

export const events = new Scenes.WizardScene<IBotContext>(
	"events",
	enterCityHandler,
	cityHandler
);
