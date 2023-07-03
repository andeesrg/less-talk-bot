import { taskEdit } from "@constants/actions";
import { Markup } from "telegraf";

export const editTaskButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(taskEdit.title.text, taskEdit.title.action),
		Markup.button.callback(taskEdit.status.text, taskEdit.status.action),
	]);
