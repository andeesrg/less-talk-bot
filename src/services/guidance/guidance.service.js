import { ConfigService } from "@config";
import {
	formAttractionsApiUrl,
	formCityGeoUrl,
	transformAttractionsData,
} from "@helpers";
import axios from "axios";

class GuidanceService {
	constructor() {
		this._apiKey = new ConfigService().get("OPENTRIP_API_KEY");
	}

	async getAttractions(city) {
		try {
			const { lat, lon, name } = await this.#getCityCoords(city);
			const { data } = await axios.get(
				formAttractionsApiUrl(lat, lon, this._apiKey)
			);

			return {
				data: transformAttractionsData(name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: "Oops attractions not found🤕!" };
		}
	}

	async #getCityCoords(city) {
		const { data } = await axios.get(formCityGeoUrl(city, this._apiKey));
		return data;
	}
}

export const guidanceService = new GuidanceService();
