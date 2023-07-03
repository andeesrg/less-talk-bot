import { nonSub, sub } from "@constants/actions";
import { Markup } from "telegraf";

export const subButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(sub.text, sub.action),
		Markup.button.callback(nonSub.text, nonSub.action),
	]);
