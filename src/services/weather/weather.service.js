import { ConfigService } from "@config";
import { formWeatherUrl, transformWeatherData } from "@helpers";
import axios from "axios";
import { geocodingService } from "./geocoding.service";

class WeatherService {
	constructor() {
		this._apiKey = new ConfigService().get("WEATHER_API_KEY");
	}

	async getCurrWeather(location) {
		const geoData = await geocodingService.getCoordinates(
			location,
			this._apiKey
		);
		const { data } = await axios.get(formWeatherUrl(geoData, this._apiKey));
		return transformWeatherData(location, data);
	}
}

export const weatherService = new WeatherService();
