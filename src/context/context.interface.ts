import { Context } from 'telegraf';

interface SessionData {
	weather: { location: string; temp: number }[];
}

export interface IBotContext extends Context {
	session: SessionData;
}
