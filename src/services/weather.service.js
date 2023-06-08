import { ConfigService } from '@config';
import { geocodingService } from '@services';
import axios from 'axios';
import { formWeatherUrl } from '@helpers';

class WeatherService {
	constructor() {
		this._apiKey = new ConfigService().get('WEATHER_API_KEY');
	}

	async getCurrWeather(location) {
		const geoData = await geocodingService.getCoordinates(
			location,
			this._apiKey
		);
		const { data } = await axios.get(formWeatherUrl(geoData, this._apiKey));
		const transformedData = await this.transformData(await data);
		return transformedData;
	}

	async transformData(data) {
		const { main } = data;
		return {
			Temperature: Math.floor(main.temp / 17) + '℃',
			'Feels like': Math.floor(main.feels_like / 17) + '℃',
			'Min temperature': Math.floor(main.temp_min / 17) + '℃',
			'Max temperature': Math.floor(main.temp_max / 17) + '℃',
			Humidity: main.humidity + '%',
		};
	}
}

export const weatherService = new WeatherService();