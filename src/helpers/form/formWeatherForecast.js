import { capitalizeWord } from "@helpers/simple";

export const formWeatherForecast = data => {
	return `
   Here's your current weather in <b>${data.city}</b>🌤️\n\n${Object.entries(
		data
	)
		.map(([key, value]) => `⚪️ <b>${capitalizeWord(key)}</b>: ${value}\n`)
		.join("")}
   `;
};
