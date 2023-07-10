import { Scenes } from "telegraf";

import { SubscribeService } from "@services";
import { IBotContext } from "@interfaces";

const unsubHandler = async (ctx: IBotContext) => {
	const subscribe = SubscribeService.getInstance();
	await subscribe.deactivateSub();
	ctx.session.userSubLocation = "";
	ctx.session.userSubTime = { hours: "", mins: "" };
	await ctx.reply("You've succesfully unsubscribed from daily weather forecast✅");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

const leaveHandler = async (ctx: IBotContext) => ctx.scene.leave();

export const unsubscribe = new Scenes.WizardScene<IBotContext>(
	"unsubscribe",
	unsubHandler,
	leaveHandler
);
