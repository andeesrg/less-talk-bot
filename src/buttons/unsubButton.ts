import { Markup } from "telegraf";

import { unsub } from "@constants/actions";

export const unsubButton = () =>
	Markup.inlineKeyboard([Markup.button.callback(unsub.text, unsub.action)]);
