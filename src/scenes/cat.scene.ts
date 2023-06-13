import { Scenes } from 'telegraf';
import { catApiUrl } from '@constants';
import { IBotContext } from '@context';

export const cat = new Scenes.WizardScene<IBotContext>('cat', async ctx => {
	await ctx.reply('Looking for a random cat picture...');
	try {
		await ctx.replyWithPhoto({ url: catApiUrl });
	} catch (e) {
		return 'Oops the image was not found🙁';
	}
	return await ctx.scene.leave();
});
