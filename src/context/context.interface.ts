import { Context, Scenes } from "telegraf";

interface MySession extends Scenes.WizardSession {
	userLocation?: string;
	chatId: number;
	userSubTime?: { hours: string; mins: string } | null;
}

export interface IBotContext extends Context {
	session: MySession;
	scene: Scenes.SceneContextScene<IBotContext, Scenes.WizardSessionData>;
	wizard: Scenes.WizardContextWizard<IBotContext>;
}
