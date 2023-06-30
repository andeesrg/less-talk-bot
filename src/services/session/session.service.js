import fs from "fs";

class SessionService {
	readData(chatId) {
		const data = fs.readFileSync(`${__dirname}sessions.json`, "utf-8");
		return this.extractData(data, chatId);
	}

	extractData(fileData, chaID) {
		const parsed = JSON.parse(fileData);
		const sessions = parsed.sessions;
		const currSession = sessions.find(
			session => session.id === `${chaID}:${chaID}`
		);
		const { chatId, userSubLocation, userSubTime } = currSession.data;
		return JSON.stringify({
			chatId,
			userSubLocation,
			userSubTime,
		});
	}
}

export const sessionService = new SessionService();
