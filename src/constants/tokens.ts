import { config } from "dotenv";

config();

export const tokens = {
	botToken: process.env.BOT_TOKEN || "",
	weatherApiToken: process.env.WEATHER_API_KEY || "",
	dbUrl: process.env.DB_URL || "",
	openTripToken: process.env.OPENTRIP_API_KEY || "",
	eventsApiToken: process.env.EVENTS_API_KEY || "",
};
