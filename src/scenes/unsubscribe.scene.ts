import { IBotContext } from "@context";
import { SubscribeService } from "@services";
import { Scenes } from "telegraf";

const unsubHandler = async (ctx: IBotContext) => {
	const subscribe = SubscribeService.getInstance();
	await subscribe.deactivateSub();
	ctx.session.userSubLocation = null;
	ctx.session.userSubTime = { hours: "", mins: "" };
	ctx.reply("You've succesfully unsubscribed from daily weather forecast✅");
	return ctx.scene.leave();
};

export const unsubscribe = new Scenes.WizardScene<IBotContext>(
	"unsubscribe",
	unsubHandler
);
