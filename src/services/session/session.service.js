import fs from "fs";

class SessionService {
	readData(chatId) {
		const data = fs.readFileSync(
			"/Users/andreysergienko/less-talk-bot/sessions.json",
			"utf-8"
		);
		return this.extractData(data, chatId);
	}

	extractData(fileData, chatId) {
		const parsed = JSON.parse(fileData);
		const sessions = parsed.sessions;
		const currSession = sessions.find(
			session => session.id === `${chatId}:${chatId}`
		);
		const { chatId, userLocation, userSubTime } = currSession.data;
		return JSON.stringify({
			chatId,
			userLocation,
			userSubTime,
		});
	}
}

export const sessionService = new SessionService();
