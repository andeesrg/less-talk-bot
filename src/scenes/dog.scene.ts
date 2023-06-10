import { Scenes } from 'telegraf';
import { dogApiUrl } from '@constants';
import axios from 'axios';

export const dog = new Scenes.WizardScene<Scenes.WizardContext>(
	'dog',
	async ctx => {
		await ctx.reply('Looking for a random dog picture...');
		try {
			const { data } = await axios.get(dogApiUrl);
			await ctx.replyWithPhoto({ url: data.message });
		} catch (e) {
			return 'Oops the image was not found🙁';
		}
		return await ctx.scene.leave();
	}
);
