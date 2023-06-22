import { taskIdRegex } from "@constants";

export const extractTaskId = msg => {
	const match = msg.match(taskIdRegex);
	return Number(match[0]);
};
