import { ConfigService } from "@config";
import { MongoClient } from "mongodb";

class DatabaseService {
	constructor() {
		this._dbUrl = new ConfigService().get("DB_URL");
	}

	async connectToDB() {
		const client = new MongoClient(this._dbUrl);
		await client.connect();
		const db = client.db("less_talk_bot");
		const collection = db.collection("users");
		this.users = collection;
	}

	async setUser(chatId, userName) {
		const existedUser = await this.isUserExists(chatId, userName);
		if (existedUser) return { userName: existedUser };
		await this.users.insertOne({
			userName,
			chatId,
		});
		return { userName };
	}

	async isUserExists(chatId, userName) {
		const matchedUser = await this.users.findOne(
			{ chatId, userName },
			{ userName: 1 }
		);
		if (matchedUser) return userName;
		return null;
	}
}

export const dbService = new DatabaseService();
