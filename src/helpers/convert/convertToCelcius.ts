export const convertToCelcius = (temp: number): string =>
	Math.floor(temp - 273.15) + "℃";
