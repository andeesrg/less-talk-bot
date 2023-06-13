import { locationRegex } from '@constants/regex';

export const extractLocation = msg => {
	const match = msg.match(locationRegex);
	if (!match) return null;

	const userLocation = match[0].split(',');
	return userLocation[0];
};
