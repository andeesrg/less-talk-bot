export const formWeatherForecast = data => `
   Here's your current weather in <b>${data.city}</b>🌤️\n\n${Object.entries(data)
	.map(([key, value]) => `⚪️ <b>${capitalizeWord(key)}</b>: ${value}\n`)
	.join("")}
   `;

function capitalizeWord(str) {
	return str[0].toUpperCase() + str.slice(1);
}
