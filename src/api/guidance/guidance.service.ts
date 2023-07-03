import axios from "axios";

import { notFound, tokens } from "@constants";
import {
	formAttractionsApiUrl,
	formEventsApiUrl,
	formFoodApiUrl,
	transformAttractionsData,
	transformFoodData,
} from "@helpers";

import { geocoderService } from "../geocoder";

class GuidanceService {
	private opentripApiKey: string;
	private eventsApiKey: string;
	private geocoderApiKey: string;

	constructor() {
		this.opentripApiKey = tokens.openTripToken;
		this.eventsApiKey = tokens.eventsApiToken;
		this.geocoderApiKey = tokens.weatherApiToken;
	}

	async getAttractions(city: string) {
		try {
			const { geoData, error } = await geocoderService.getCoordinates(city, this.geocoderApiKey);

			if (error) return { data: null, error };
			const { data } = await axios.get(
				formAttractionsApiUrl(geoData?.lat, geoData?.lon, this.opentripApiKey)
			);

			return {
				data: transformAttractionsData(geoData?.name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: notFound.attractions };
		}
	}

	async getFoodPlaces(city: string) {
		try {
			const { geoData, error } = await geocoderService.getCoordinates(city, this.geocoderApiKey);

			if (error) return { data: null, error };

			const { data } = await axios.get(
				formFoodApiUrl(geoData?.lat, geoData?.lon, this.opentripApiKey)
			);

			return {
				data: transformFoodData(geoData?.name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: notFound.eateries };
		}
	}

	async getEvents(city: string) {
		try {
			const { geoData, error } = await geocoderService.getCoordinates(city, this.geocoderApiKey);

			if (error) return { data: null, error };

			const { data } = await axios.get(formEventsApiUrl(geoData?.country), {
				headers: {
					"X-Api-Key": this.eventsApiKey,
				},
			});

			return { data: { city: geoData?.name, result: data }, error: null };
		} catch (error) {
			return {
				data: null,
				error: notFound.events,
			};
		}
	}
}

export const guidanceService = new GuidanceService();
