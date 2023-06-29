import { tasks as taskActions } from "@constants";
import { IBotContext } from "@context";
import { Composer, Scenes } from "telegraf";

const taskHandler = new Composer<IBotContext>();

taskHandler.hears(taskActions.read.action, ctx => {
	ctx.scene.enter("readTasks");
});

taskHandler.hears(taskActions.create.action, ctx =>
	ctx.scene.enter("createTask")
);

taskHandler.hears(taskActions.edit.action, ctx => {
	ctx.scene.enter("editTask");
});

taskHandler.hears(taskActions.remove.action, ctx => {
	ctx.scene.enter("removeTask");
});

export const tasks = new Scenes.WizardScene<IBotContext>("tasks", taskHandler);
