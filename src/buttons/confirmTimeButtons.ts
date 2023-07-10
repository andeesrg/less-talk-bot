import { Markup } from "telegraf";

import { confirmTime, editTime } from "@constants/actions";

export const confirmTimeButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(confirmTime.text, confirmTime.action),
		Markup.button.callback(editTime.text, editTime.action),
	]);
