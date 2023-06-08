import { formGeocodingUrl } from '@helpers';
import axios from 'axios';

class GeocodingService {
	async getCoordinates(location, apiKey) {
		try {
			const { data } = await axios.get(formGeocodingUrl(location, apiKey));
			const extractedData = this.extractData(await data);
			return extractedData;
		} catch (e) {
			return 'Wrong coordinates!🙁';
		}
	}

	extractData(data) {
		const resData = data[0];
		return {
			name: resData.name,
			lat: resData.lat,
			lon: resData.lon,
		};
	}
}

export const geocodingService = new GeocodingService();
