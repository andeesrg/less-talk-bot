export interface IEditTaskParams {
	id: number;
	editType: "title" | "status";
	content: string | boolean;
}
