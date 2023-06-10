import { ConfigService } from '@config';
import { geocodingService } from './geocoding.service';
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
		const transformedData = await this.transformData({
			...(await data.main),
			city: geoData.name,
		});
		return transformedData;
	}

	async transformData(data) {
		return {
			City: data.city,
			Temperature: Math.floor(data.temp / 17) + '℃',
			'Feels like': Math.floor(data.feels_like / 17) + '℃',
			'Min temperature': Math.floor(data.temp_min / 17) + '℃',
			'Max temperature': Math.floor(data.temp_max / 17) + '℃',
			Humidity: data.humidity + '%',
		};
	}
}

export const weatherService = new WeatherService();
