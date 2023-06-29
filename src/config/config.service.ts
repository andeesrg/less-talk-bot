import { IConfigService } from "@interfaces";
import { DotenvParseOutput, configDotenv } from "dotenv";

export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor() {
		const { error, parsed } = configDotenv();
		if (error) throw new Error("File .env is not found");
		if (!parsed) throw new Error("File .env is empty");
		this.config = parsed;
	}
	get(key: string): string {
		const res = this.config[key];
		if (!res) throw new Error("No founds by this key");
		return res;
	}
}
