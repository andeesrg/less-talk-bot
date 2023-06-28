export const extractDate = (date, day) =>
	date.split("-").reverse().slice(0, 2).join(".") + `(${day})`;
