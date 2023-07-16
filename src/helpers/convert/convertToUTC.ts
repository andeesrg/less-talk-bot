export const convertToUTC = (hours: number): number => {
	const delta = hours - 3;
    
	if (delta >= 0) return delta;

	return 24 + delta;
};
