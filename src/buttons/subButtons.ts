import { Markup } from "telegraf";

import { nonSub, sub } from "@constants/actions";

export const subButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(sub.text, sub.action),
		Markup.button.callback(nonSub.text, nonSub.action),
	]);
