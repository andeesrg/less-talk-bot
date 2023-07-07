import axios from "axios";

import { transformWeatherData } from "@helpers";
import { tokens, weatherUrl } from "@constants";

import { geocoderService } from "../geocoder";

class WeatherService {
	private apiKey: string;

	constructor() {
		this.apiKey = tokens.weatherApiToken;
	}

	async getCurrWeather(location: string) {
		const { geoData, error } = await geocoderService.getCoordinates(location, this.apiKey);
		if (error) return { data: null, error };

		const { data } = await axios.get(weatherUrl, {
			params: { lat: geoData?.lat, lon: geoData?.lon, appid: this.apiKey },
		});
		const transformedData = transformWeatherData(geoData?.name, data);
		return { data: transformedData, error: null };
	}
}

export const weatherService = new WeatherService();
