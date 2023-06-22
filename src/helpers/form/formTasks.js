const isCompleted = value => (!!value ? "✅" : "❌");

export const formTasks = tasks => {
	if (!tasks.length) "Your tasks list is empty☁️";

	return `🗒️Here's your current list of tasks\n\n${tasks
		.map(
			(task, idx) =>
				`${idx + 1}. ${task.title} ${isCompleted(task.isCompleted)}\n`
		)
		.join("")}`;
};
