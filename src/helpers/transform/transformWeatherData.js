import { convertToCelcius } from "@helpers/convert";

export function transformWeatherData(city, data) {
	const condition = data.weather[0].description;
	const { main } = data;
	const visibility = (data.visibility / 1000).toFixed(0);
	const windSpeed = data.wind.speed.toFixed(0);

	return {
		city,
		condition: capitalizeWord(condition),
		temperature: convertToCelcius(main.temp),
		feels: convertToCelcius(main.feels_like),
		min: convertToCelcius(main.temp_min),
		max: convertToCelcius(main.temp_max),
		visibility: `${visibility} km`,
		"wind speed": `${windSpeed} mps`,
		humidity: `${main.humidity}%`,
	};
}

function capitalizeWord(str) {
	return str[0].toUpperCase() + str.slice(1);
}
