import { Composer, Scenes } from "telegraf";

import { IBotContext } from "@interfaces";
import { tasks as taskActions } from "@constants";

const taskHandler = new Composer<IBotContext>();

taskHandler.hears(taskActions.read.action, async ctx => {
	await ctx.scene.enter("readTasks");
});

taskHandler.hears(taskActions.create.action, async ctx => {
	await ctx.scene.enter("createTask");
});

taskHandler.hears(taskActions.edit.action, async ctx => {
	await ctx.scene.enter("editTask");
});

taskHandler.hears(taskActions.remove.action, async ctx => {
	await ctx.scene.enter("removeTask");
});

export const tasks = new Scenes.WizardScene<IBotContext>("tasks", taskHandler);
