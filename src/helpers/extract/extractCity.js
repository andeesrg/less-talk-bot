import { cityRegex } from "@constants/regex";

export const extractCity = msg => {
	const match = msg.match(cityRegex);
	if (!match) return null;

	const userLocation = match[0].split(",");
	return userLocation[0];
};
