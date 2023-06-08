export const formWeatherData = async data => {
	if (typeof data === 'string') return data;
	return `
   Here's your current weather forecast☀️\n\n${Object.entries(data)
		.map(([key, value]) => `⚪️${key}: ${value}\n`)
		.join('')}
   `;
};
