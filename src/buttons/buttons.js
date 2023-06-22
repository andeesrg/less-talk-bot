import { subActions, taskActions, taskEditActions } from "@constants";
import { Markup } from "telegraf";

export const subButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(subActions.sub.text, subActions.sub.action),
		Markup.button.callback(
			subActions.dontSub.text,
			subActions.dontSub.action
		),
	]);

export const confirmButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(
			subActions.confirmTime.text,
			subActions.confirmTime.action
		),
		Markup.button.callback(
			subActions.editTime.text,
			subActions.editTime.action
		),
	]);

export const tasksControlButtons = () =>
	Markup.keyboard([
		Markup.button.callback(
			taskActions.createTask.text,
			taskActions.createTask.action
		),
		Markup.button.callback(
			taskActions.readTasks.text,
			taskActions.readTasks.action
		),
		Markup.button.callback(
			taskActions.editTask.text,
			taskActions.editTask.action
		),
		Markup.button.callback(
			taskActions.removeTask.text,
			taskActions.removeTask.action
		),
	]).resize();

export const taskEditButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(
			taskEditActions.title.text,
			taskEditActions.title.action
		),
		Markup.button.callback(
			taskEditActions.status.text,
			taskEditActions.status.action
		),
	]);
