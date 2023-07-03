import { IBotContext } from "@interfaces";
import { SubscribeService } from "@services";
import { Scenes } from "telegraf";

const unsubHandler = async (ctx: IBotContext) => {
	const subscribe = SubscribeService.getInstance();
	await subscribe.deactivateSub();
	ctx.session.userSubLocation = "";
	ctx.session.userSubTime = { hours: "", mins: "" };
	await ctx.reply(
		"You've succesfully unsubscribed from daily weather forecast✅"
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

const leaveHandler = async (ctx: IBotContext) => {
	return await ctx.scene.leave();
};

export const unsubscribe = new Scenes.WizardScene<IBotContext>(
	"unsubscribe",
	unsubHandler,
	leaveHandler
);
