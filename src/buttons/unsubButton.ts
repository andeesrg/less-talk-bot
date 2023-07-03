import { unsub } from "@constants/actions";
import { Markup } from "telegraf";

export const unsubButton = () =>
	Markup.inlineKeyboard([Markup.button.callback(unsub.text, unsub.action)]);
