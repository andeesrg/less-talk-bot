import { badAttractions, badEvents, badFoodPlaces, tokens } from "@constants";
import {
	formAttractionsApiUrl,
	formCityGeoUrl,
	formEventsApiUrl,
	formFoodApiUrl,
	transformAttractionsData,
	transformFoodData,
} from "@helpers";
import axios from "axios";

class GuidanceService {
	constructor() {
		this._opentripApiKey = tokens.openTripToken;
		this._eventsApiKey = tokens.eventsApiToken;
	}

	async getAttractions(city) {
		try {
			const { lat, lon, name } = await this.#getCityCoords(city);
			const { data } = await axios.get(
				formAttractionsApiUrl(lat, lon, this._opentripApiKey)
			);

			return {
				data: transformAttractionsData(name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: badAttractions };
		}
	}

	async getFoodPlaces(city) {
		try {
			const { lat, lon, name } = await this.#getCityCoords(city);

			const { data } = await axios.get(
				formFoodApiUrl(lat, lon, this._opentripApiKey)
			);

			return {
				data: transformFoodData(name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: badFoodPlaces };
		}
	}

	async getEvents(city) {
		try {
			const { country } = await this.#getCityCoords(city);

			const { data } = await axios.get(formEventsApiUrl(country), {
				headers: {
					"X-Api-Key": this._eventsApiKey,
				},
			});

			return { data: { city, result: data }, error: null };
		} catch (error) {
			return {
				data: null,
				error: badEvents,
			};
		}
	}

	async #getCityCoords(city) {
		const { data } = await axios.get(
			formCityGeoUrl(city, this._opentripApiKey)
		);
		return data;
	}
}

export const guidanceService = new GuidanceService();
