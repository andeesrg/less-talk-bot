import { Context, Scenes } from "telegraf";

interface MySceneSession extends Scenes.WizardSessionData {
	taskId: number | string;
}

interface MySession extends Scenes.WizardSession<MySceneSession> {
	userLocation?: string;
	chatId: number;
	userSubTime?: { hours: string; mins: string } | null;
}

export interface IBotContext extends Context {
	session: MySession;
	scene: Scenes.SceneContextScene<IBotContext, MySceneSession>;
	wizard: Scenes.WizardContextWizard<IBotContext>;
}
