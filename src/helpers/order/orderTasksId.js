export const orderTasksId = tasks =>
	tasks.map((task, idx) => ({ ...task, id: idx + 1 }));
