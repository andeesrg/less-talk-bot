import { formGeocodingUrl } from "@helpers";
import axios from "axios";

class GeocodingService {
	async getCoordinates(location, apiKey) {
		const { data } = await axios.get(formGeocodingUrl(location, apiKey));
		const extractedData = this.#extractData(await data);
		return extractedData;
	}

	#extractData(data) {
		const { name, lat, lon } = data[0];
		return { name, lat, lon };
	}
}

export const geocodingService = new GeocodingService();
