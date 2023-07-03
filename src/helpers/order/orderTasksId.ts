import { ITask } from "@interfaces";

export const orderTasksId = (tasks: ITask[]): ITask[] =>
	tasks.map((task, idx) => ({ ...task, id: idx + 1 }));
