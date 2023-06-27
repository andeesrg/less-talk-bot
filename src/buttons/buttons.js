import {
	confirmTime,
	editTime,
	nonSub,
	sub,
	subCity,
	taskEdit,
	tasks,
	unsub,
} from "@constants/actions";
import { Markup } from "telegraf";

export const subButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(sub.text, sub.action),
		Markup.button.callback(nonSub.text, nonSub.action),
	]);

export const unsubButton = () =>
	Markup.inlineKeyboard([Markup.button.callback(unsub.text, unsub.action)]);

export const subCityButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(subCity.currCity.text, subCity.currCity.action),
		Markup.button.callback(subCity.newCity.text, subCity.newCity.action),
	]);

export const confirmTimeButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(confirmTime.text, confirmTime.action),
		Markup.button.callback(editTime.text, editTime.action),
	]);

export const tasksControlButtons = () =>
	Markup.keyboard(
		[
			Markup.button.callback(tasks.create.text, tasks.create.action),
			Markup.button.callback(tasks.read.text, tasks.read.action),
			Markup.button.callback(tasks.edit.text, tasks.edit.action),
			Markup.button.callback(tasks.remove.text, tasks.remove.action),
		],
		{
			columns: 2,
		}
	).resize();

export const taskEditButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(taskEdit.title.text, taskEdit.title.action),
		Markup.button.callback(taskEdit.status.text, taskEdit.status.action),
	]);
