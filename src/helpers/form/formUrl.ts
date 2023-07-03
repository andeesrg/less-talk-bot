export const formWeatherGeoUrl = (location: string, apiKey: string): string =>
	`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

export const formWeatherUrl = (lat: number, lon: number, apiKey: string): string =>
	`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

export const formAttractionsApiUrl = (lat: number, lon: number, apiKey: string): string =>
	`http://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places&limit=100&apikey=${apiKey}`;

export const formFoodApiUrl = (lat: number, lon: number, apiKey: string): string =>
	`https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=foods&limit=100&apikey=${apiKey}`;

export const formEventsApiUrl = (countryCode: string): string =>
	`https://api.api-ninjas.com/v1/holidays?country=${countryCode}&year=${new Date().getFullYear()}`;
