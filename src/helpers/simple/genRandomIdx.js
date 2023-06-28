export function genRandomIdx(n) {
	const randomNum = Math.round(Math.random() * n);
	if (randomNum - 5 < 0 || n - randomNum < 5) {
		genRandomIdx(n);
	}
	return randomNum;
}
