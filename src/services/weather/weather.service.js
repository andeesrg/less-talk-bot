import { ConfigService } from "@config";
import { convertToCelcius, formWeatherUrl } from "@helpers";
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
		const transformedData = await this.#transformData({
			...(await data.main),
			city: geoData.name,
		});
		return transformedData;
	}

	async #transformData(data) {
		return {
			City: data.city,
			Temperature: convertToCelcius(data.temp),
			Feels: convertToCelcius(data.feels_like),
			Min: convertToCelcius(data.temp_min),
			Max: convertToCelcius(data.temp_max),
			Humidity: data.humidity + "%",
		};
	}
}

export const weatherService = new WeatherService();
