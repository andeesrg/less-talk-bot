import axios from "axios";

import { notFound } from "@constants";

class GeocoderService {
	async getCoordinates(location: string, apiKey: string) {
		const { data } = await axios.get("http://api.openweathermap.org/geo/1.0/direct", {
			params: { q: location, appid: apiKey },
		});

		if (!data?.length) return { geoData: null, error: notFound.city };

		const extractedData = this.extractData(await data);
		return { geoData: extractedData, error: null };
	}

	private extractData(data: any[]) {
		const { lat, lon, name, country } = data[0];
		return { lat, lon, name, country };
	}
}

export const geocoderService = new GeocoderService();
