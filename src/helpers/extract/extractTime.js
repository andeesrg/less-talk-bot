import { extractMinsRegex, timeRegex } from "@constants/regex";

export const extractTime = msg => {
	const match = msg.match(timeRegex);
	if (!match) return { hours: "", mins: "" };

	const [hours, minutes] = match[0].split(":");
	const mins = minutes.match(extractMinsRegex)[0];
	return { hours, mins };
};
