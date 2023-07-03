import { MongoClient } from "mongodb";

import { tokens } from "@constants";
import { IEditTaskParams } from "@interfaces";
import { orderTasksId } from "@helpers";

class DatabaseService {
	private dbUrl: string;

	private users: any;

	constructor() {
		this.dbUrl = tokens.dbUrl;
		this.users = [];
	}

	async connectToDB() {
		const client = new MongoClient(this.dbUrl);
		await client.connect();
		const db = client.db("less_talk_bot");
		const collection = db.collection("users");
		this.users = collection;
	}

	async initUser(chatId: number, userName: string) {
		const existedUser = await this.#isUserExists(chatId, userName);
		if (existedUser) return { userName: existedUser };
		await this.users.insertOne({
			userName,
			chatId,
			tasks: [],
		});
		return { userName };
	}

	async readTasks(chatId: number) {
		const user = await this.users.findOne({ chatId });
		return user?.tasks;
	}

	async createTask(chatId: number, title: string) {
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

	async editTask(chatId: number, task: IEditTaskParams) {
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

	async removeTask(chatId: number, taskId: number) {
		await this.users.updateOne({ chatId }, { $pull: { tasks: { id: taskId } } });
		const orderedTasks = orderTasksId(await this.readTasks(chatId));
		await this.users.findOneAndUpdate({ chatId }, { $set: { tasks: orderedTasks } });
	}

	async #isUserExists(chatId: number, userName: string) {
		const matchedUser = await this.users.findOne({ chatId, userName });
		if (!matchedUser) return null;
		return userName;
	}
}

export const dbService = new DatabaseService();
