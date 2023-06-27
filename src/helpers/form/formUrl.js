export const formWeatherGeoUrl = (location, apiKey) =>
	`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

export const formWeatherUrl = (coords, apiKey) =>
	`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;

export const formCityGeoUrl = (location, apiKey) =>
	`http://api.opentripmap.com/0.1/ru/places/geoname?name=${location}&apikey=${apiKey}`;

export const formAttractionsApiUrl = (lat, lon, apiKey) =>
	`http://api.opentripmap.com/0.1/ru/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&limit=100&apikey=${apiKey}`;
