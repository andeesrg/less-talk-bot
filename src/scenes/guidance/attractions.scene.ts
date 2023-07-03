import { cityRegex } from "@constants";
import { IBotContext } from "@context";
import { formAttractions } from "@helpers/form";
import { guidanceService } from "@api";
import { Composer, Scenes } from "telegraf";

const cityHandler = new Composer<IBotContext>();

const enterCityHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("🌆Enter city in format <b>City</b>");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

cityHandler.hears(cityRegex, async ctx => {
	await ctx.replyWithHTML("🔎<b>Looking for attractions...</b>");
	const { data, error } = await guidanceService.getAttractions(
		ctx.message.text
	);

	if (error) {
		await ctx.reply(error);
		return ctx.scene.leave();
	}

	await ctx.replyWithHTML(formAttractions(data));
	return ctx.scene.leave();
});
cityHandler.on("text", async ctx => {
	if (!cityRegex.test(ctx.message.text)) {
		await ctx.replyWithHTML(
			"<b>City</b> is invalid ❌\nEnter city in proper format <b>City</b>"
		);
	}
});

export const attractions = new Scenes.WizardScene<IBotContext>(
	"attractions",
	enterCityHandler,
	cityHandler
);
