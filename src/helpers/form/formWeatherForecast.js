import { capitalizeWord } from "@helpers/simple";

export const formWeatherForecast = data => {
	return `
   Here's your current weather in *${data.city}*🌤️\n\n${Object.entries(data)
		.map(([key, value]) => `⚪️ *${capitalizeWord(key)}*: ${value}\n`)
		.join("")}
   `;
};
