import fs from 'fs';

class SessionService {
	readData() {
		const data = fs.readFileSync(
			'/Users/andreysergienko/less-talk-bot/sessions.json',
			'utf-8'
		);
		return this.extractData(data);
	}

	extractData(fileData) {
		const parsed = JSON.parse(fileData);
		const sessions = parsed?.sessions;
		const lastSession = sessions[sessions?.length - 1];
		const { chatId, userLocation, userRemindTime } = lastSession.data;
		return JSON.stringify({
			chatId,
			userLocation,
			userRemindTime,
		});
	}
}

export const sessionService = new SessionService();
