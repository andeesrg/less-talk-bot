import { confirmTime, editTime } from "@constants/actions";
import { Markup } from "telegraf";

export const confirmTimeButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(confirmTime.text, confirmTime.action),
		Markup.button.callback(editTime.text, editTime.action),
	]);
