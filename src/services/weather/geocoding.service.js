import { notFound } from "@constants";
import { formWeatherGeoUrl } from "@helpers";
import axios from "axios";

class GeocodingService {
	async getCoordinates(location, apiKey) {
		const { data } = await axios.get(formWeatherGeoUrl(location, apiKey));

		if (!data?.length) return { geoData: null, error: notFound.city };

		const extractedData = this.#extractData(await data);
		return { geoData: extractedData, error: null };
	}

	#extractData(data) {
		const { lat, lon, name, country } = data[0];
		return { lat, lon, name, country };
	}
}

export const geocodingService = new GeocodingService();
