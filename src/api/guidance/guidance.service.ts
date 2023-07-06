import axios from "axios";

import { transformAttractionsData, transformFoodData } from "@helpers";
import { eventsUrl, notFound, openTripUrl, tokens } from "@constants";

import { geocoderService } from "../geocoder";

class GuidanceService {
	private openTripApiKey: string;
	private eventsApiKey: string;
	private geocoderApiKey: string;

	constructor() {
		this.openTripApiKey = tokens.openTripToken;
		this.eventsApiKey = tokens.eventsApiToken;
		this.geocoderApiKey = tokens.weatherApiToken;
	}

	async getAttractions(city: string) {
		try {
			const { geoData, error } = await geocoderService.getCoordinates(city, this.geocoderApiKey);

			if (error) return { data: null, error };

			const { data } = await axios.get(openTripUrl, {
				params: {
					radius: 5000,
					lon: geoData?.lon,
					lat: geoData?.lat,
					kinds: "interesting_places",
					limit: 100,
					apikey: this.openTripApiKey,
				},
			});

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

			const { data } = await axios.get(openTripUrl, {
				params: {
					radius: 5000,
					lon: geoData?.lon,
					lat: geoData?.lat,
					kinds: "foods",
					limit: 100,
					apikey: this.openTripApiKey,
				},
			});

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

			const { data } = await axios.get(eventsUrl, {
				params: {
					country: geoData?.country,
					year: new Date().getFullYear(),
				},
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
