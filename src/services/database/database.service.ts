import mongoose from "mongoose";

import { User } from "@models";
import { orderTasksId } from "@helpers";
import { IEditTaskParams } from "@interfaces";
import { tokens } from "@constants";

class DatabaseService {
	private dbUrl: string;

	constructor() {
		this.dbUrl = tokens.dbUrl;
	}

	async connectToDb() {
		try {
			mongoose.set({ strictQuery: true });
			await mongoose.connect(this.dbUrl);
		} catch (error) {
			console.log(error);
		}
	}

	async initUser(chatId: number, userName: string) {
		const existedUser = await this.isUserExisted(chatId, userName);
		if (existedUser) return { userName: existedUser };
		const user = new User({ userName, chatId, tasks: [] });
		await user.save();
		return { userName };
	}

	async readTasks(chatId: number) {
		const user = await User.findOne({ chatId }, { tasks: 1, _id: 0 });
		return user ? user.tasks : [];
	}

	async createTask(chatId: number, title: string) {
		const tasks = await this.readTasks(chatId);
		await User.findOneAndUpdate(
			{ chatId },
			{
				$push: {
					tasks: { title, isCompleted: false, id: tasks?.length + 1 },
				},
			}
		);
	}

	async editTask(chatId: number, task: IEditTaskParams) {
		if (task.editType === "status") {
			await User.updateOne(
				{
					chatId,
					"tasks.id": task.id,
				},
				{
					$set: { "tasks.$.isCompleted": task.content },
				}
			);
		} else if (task.editType === "title") {
			await User.updateOne(
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
		await User.updateOne({ chatId }, { $pull: { tasks: { id: taskId } } });
		const orderedTasks = orderTasksId(await this.readTasks(chatId));
		await User.findOneAndUpdate({ chatId }, { $set: { tasks: orderedTasks } });
	}

	private async isUserExisted(chatId: number, userName: string) {
		const matchedUser = await User.findOne({ chatId });
		if (!matchedUser) return null;
		return userName;
	}
}

export const dbService = new DatabaseService();
