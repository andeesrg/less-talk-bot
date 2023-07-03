import { subCity } from "@constants/actions";
import { Markup } from "telegraf";

export const subCityButtons = () =>
	Markup.inlineKeyboard([
		Markup.button.callback(subCity.currCity.text, subCity.currCity.action),
		Markup.button.callback(subCity.newCity.text, subCity.newCity.action),
	]);
