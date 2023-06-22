import { taskActions } from "@constants";
import { IBotContext } from "@context";
import { Composer, Scenes } from "telegraf";

const taskHandler = new Composer<IBotContext>();

taskHandler.hears(taskActions.readTasks.action, async ctx => {
	ctx.scene.enter("readTasks");
});

taskHandler.hears(taskActions.createTask.action, ctx =>
	ctx.scene.enter("createTask")
);

taskHandler.hears(taskActions.editTask.action, async ctx => {
	ctx.scene.enter("editTask");
});

taskHandler.hears(taskActions.removeTask.action, async ctx => {
	ctx.scene.enter("removeTask");
});

export const tasks = new Scenes.WizardScene<IBotContext>("tasks", taskHandler);
