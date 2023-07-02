import { tokens } from "@constants";
import { formWeatherUrl, transformWeatherData } from "@helpers";
import axios from "axios";
import { geocodingService } from "./geocoding.service";

class WeatherService {
	constructor() {
		this._apiKey = tokens.weatherApiToken;
	}

	async getCurrWeather(location) {
		const { geoData, error } = await geocodingService.getCoordinates(
			location,
			this._apiKey
		);
		if (error) return { data: null, error };
		const { data } = await axios.get(formWeatherUrl(geoData, this._apiKey));
		const transformedData = transformWeatherData(geoData.name, data);
		return { data: transformedData, error: null };
	}
}

export const weatherService = new WeatherService();
