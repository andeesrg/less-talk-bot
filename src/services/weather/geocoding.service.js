import { formGeocodingUrl } from "@helpers";
import axios from "axios";

class GeocodingService {
	async getCoordinates(location, apiKey) {
		const { data } = await axios.get(formGeocodingUrl(location, apiKey));
		const extractedData = this.#extractData(await data);
		return extractedData;
	}

	#extractData(data) {
		const { lat, lon } = data[0];
		return { lat, lon };
	}
}

export const geocodingService = new GeocodingService();
