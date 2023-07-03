export function genRandomRate(min: number, max: number): number {
	const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
	if (randomNum === max) {
		return genRandomRate(min, max);
	}
	return randomNum;
}
