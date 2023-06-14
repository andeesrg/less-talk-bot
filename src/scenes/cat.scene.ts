import { Scenes } from 'telegraf';
import { catApiUrl } from '@constants';
import { IBotContext } from '@context';

const requestHandler = async (ctx: IBotContext) => {
	await ctx.reply('Looking for a random cat picture...');
	try {
		await ctx.replyWithPhoto({ url: catApiUrl });
	} catch (e) {
		return 'Oops the image was not found🙁';
	}
	return await ctx.scene.leave();
};

export const cat = new Scenes.WizardScene<IBotContext>('cat', requestHandler);