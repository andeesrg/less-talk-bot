import { cityRegex } from "@constants";
import { IBotContext } from "@context";
import { formFoodPlaces } from "@helpers";
import { guidanceService } from "@api";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("🌃Enter city in format <b>City</b>");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

cityHandler.hears(cityRegex, async ctx => {
	await ctx.replyWithHTML("🍟<b>Gathering eateries...</b>");
	const { data, error } = await guidanceService.getFoodPlaces(ctx.message.text);

	if (error) {
		await ctx.reply(error);
		return ctx.scene.leave();
	}

	await ctx.replyWithHTML(formFoodPlaces(data));
	return ctx.scene.leave();
});
cityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithHTML(
			"<b>City</b> is invalid ❌\nEnter city in proper format <b>City</b>"
		);
	}
});

export const food = new Scenes.WizardScene<IBotContext>(
	"food",
	enterCityHandler,
	cityHandler
);
