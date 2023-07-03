export const extractDate = (date: string, day: string): string =>
	`${date.split("-").reverse().slice(0, 2).join(".")}(${day})`;
