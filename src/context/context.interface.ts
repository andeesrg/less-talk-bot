import { Context, Scenes } from "telegraf";

interface MySceneSession extends Scenes.WizardSessionData {
	taskId: number | string;
	userLocation: string;
}

interface MySession extends Scenes.WizardSession<MySceneSession> {
	chatId: number;
	userSubLocation?: string | null;
	userSubTime?: { hours: string; mins: string } | null;
}

export interface IBotContext extends Context {
	session: MySession;
	scene: Scenes.SceneContextScene<IBotContext, MySceneSession>;
	wizard: Scenes.WizardContextWizard<IBotContext>;
}
