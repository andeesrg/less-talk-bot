import { catApiUrl } from "@constants";
import { IBotContext } from "@context";
import { Scenes } from "telegraf";

const requestPicHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2("🔎*Looking for a random cat picture\\.\\.\\.🐈*");
	try {
		await ctx.replyWithPhoto({ url: catApiUrl });
	} catch (e) {
		return "Oops the image was not found🙁";
	}
	return ctx.scene.leave();
};

export const cat = new Scenes.WizardScene<IBotContext>(
	"cat",
	requestPicHandler
);
