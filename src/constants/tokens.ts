import { config } from "dotenv";

config();

export const tokens = {
	botToken: process.env.BOT_TOKEN || "",
	weatherToken: process.env.WEATHER_TOKEN || "",
	dbToken: process.env.DB_URL || "",
	openTripToken: process.env.OPENTRIP_API_KEY || "",
	eventsApiToken: process.env.EVENTS_API_KEY || "",
};
