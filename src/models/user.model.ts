import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		required: true,
	},
	id: {
		type: Number,
		required: true,
	},
});

const userSchema = new Schema({
	userName: {
		type: String,
		required: true,
	},
	chatId: {
		type: Number,
		required: true,
	},
	tasks: [taskSchema],
});

export const User = mongoose.model("User", userSchema);
