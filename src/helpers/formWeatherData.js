export const formWeatherData = data => {
	return `
   *Here's your current weather forecast*☀️\n\n${Object.entries(data)
		.map(([key, value]) => `⚪️ *${key}*: ${value}\n`)
		.join('')}
   `;
};
