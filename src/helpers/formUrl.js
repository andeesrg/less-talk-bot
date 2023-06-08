export const formGeocodingUrl = (location, apiKey) =>
	`http://api.openweathermap.org/geo/1.0/direct?q=${location.city}&limit=1&appid=${apiKey}`;

export const formWeatherUrl = (coords, apiKey) =>
	`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
