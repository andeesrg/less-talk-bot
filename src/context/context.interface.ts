import { Context } from 'telegraf';
import { WizardContext, WizardSession } from 'telegraf/typings/scenes';

interface Session extends WizardSession {
	userLocation: string;
}

export interface IBotContext extends WizardContext, Context {
	session: Session;
}
