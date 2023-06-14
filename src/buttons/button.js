import { actions } from "@constants";
import { Markup } from "telegraf";

export const subButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(actions.sub.text, actions.sub.action),
		Markup.button.callback(actions.dontSub.text, actions.dontSub.action),
	]);
export const confirmButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(
			actions.confirmTime.text,
			actions.confirmTime.action
		),
		Markup.button.callback(actions.editTime.text, actions.editTime.action),
	]);
