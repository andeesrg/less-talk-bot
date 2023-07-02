import { badAttractions, badEvents, badFoodPlaces, tokens } from "@constants";
import {
	formAttractionsApiUrl,
	formEventsApiUrl,
	formFoodApiUrl,
	transformAttractionsData,
	transformFoodData,
} from "@helpers";
import { geocodingService } from "@services/weather/geocoding.service";
import axios from "axios";

class GuidanceService {
	constructor() {
		this._opentripApiKey = tokens.openTripToken;
		this._eventsApiKey = tokens.eventsApiToken;
		this._geocodingApiKey = tokens.weatherApiToken;
	}

	async getAttractions(city) {
		try {
			const { geoData, error } = await geocodingService.getCoordinates(
				city,
				this._geocodingApiKey
			);

			if (error) return { data: null, error };
			const { data } = await axios.get(
				formAttractionsApiUrl(
					geoData.lat,
					geoData.lon,
					this._opentripApiKey
				)
			);

			return {
				data: transformAttractionsData(geoData.name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: badAttractions };
		}
	}

	async getFoodPlaces(city) {
		try {
			const { geoData, error } = await geocodingService.getCoordinates(
				city,
				this._geocodingApiKey
			);

			if (error) return { data: null, error };

			const { data } = await axios.get(
				formFoodApiUrl(geoData.lat, geoData.lon, this._opentripApiKey)
			);

			return {
				data: transformFoodData(geoData.name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: badFoodPlaces };
		}
	}

	async getEvents(city) {
		try {
			const { geoData, error } = await geocodingService.getCoordinates(
				city,
				this._geocodingApiKey
			);

			if (error) return { data: null, error };

			const { data } = await axios.get(formEventsApiUrl(geoData.country), {
				headers: {
					"X-Api-Key": this._eventsApiKey,
				},
			});

			return { data: { city: geoData.name, result: data }, error: null };
		} catch (error) {
			return {
				data: null,
				error: badEvents,
			};
		}
	}
}

export const guidanceService = new GuidanceService();
