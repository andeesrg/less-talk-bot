import { tokens } from "@constants";
import { orderTasksId } from "@helpers";
import { MongoClient } from "mongodb";

class DatabaseService {
	constructor() {
		this._dbUrl = tokens.dbUrl;
	}

	async connectToDB() {
		const client = new MongoClient(this._dbUrl);
		await client.connect();
		const db = client.db("less_talk_bot");
		const collection = db.collection("users");
		this.users = collection;
	}

	async initUser(chatId, userName) {
		const existedUser = await this.#isUserExists(chatId, userName);
		if (existedUser) return { userName: existedUser };
		await this.users.insertOne({
			userName,
			chatId,
			tasks: [],
		});
		return { userName };
	}

	async readTasks(chatId) {
		const user = await this.users.findOne({ chatId });
		return user?.tasks;
	}

	async createTask(chatId, title) {
		const tasks = await this.readTasks(chatId);
		await this.users.updateOne(
			{ chatId },
			{
				$push: {
					tasks: { title, isCompleted: false, id: tasks.length + 1 },
				},
			}
		);
	}

	async editTask(chatId, task) {
		if (task.editType === "status") {
			await this.users.updateOne(
				{
					chatId,
					"tasks.id": task.id,
				},
				{
					$set: { "tasks.$.isCompleted": task.content },
				}
			);
		} else if (task.editType === "title") {
			await this.users.updateOne(
				{
					chatId,
					"tasks.id": task.id,
				},
				{
					$set: { "tasks.$.title": task.content },
				}
			);
		}
	}

	async removeTask(chatId, taskId) {
		await this.users.updateOne(
			{ chatId },
			{ $pull: { tasks: { id: taskId } } }
		);
		const orderedTasks = orderTasksId(await this.readTasks(chatId));
		await this.users.findOneAndUpdate(
			{ chatId },
			{ $set: { tasks: orderedTasks } }
		);
	}

	async #isUserExists(chatId, userName) {
		const matchedUser = await this.users.findOne({ chatId, userName });
		if (!matchedUser) return null;
		return userName;
	}
}

export const dbService = new DatabaseService();
