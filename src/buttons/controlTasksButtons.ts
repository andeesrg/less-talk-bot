import { tasks } from "@constants/actions";
import { Markup } from "telegraf";

export const controlTasksButtons = () =>
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
