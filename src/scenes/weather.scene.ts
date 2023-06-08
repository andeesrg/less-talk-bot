import { Composer, Scenes } from 'telegraf';

const locationHandler = new Composer<Scenes.WizardContext>();
const rateHandler = new Composer<Scenes.WizardContext>();

locationHandler.on('text', async ctx => {
	if (/^[A-Z{1}a-z]*,[A-Z]+$/gm.test(ctx.message.text)) {
		await ctx.reply(
			'Great!Here`s your weather forecast...\nPlease rate our services😊'
		);
		return ctx.wizard.next();
	}
});
rateHandler.on('text', async ctx => {
	await ctx.reply('Thanks for your rate!We appreciate it =)');
	return ctx.scene.leave();
});

export const weather = new Scenes.WizardScene<Scenes.WizardContext>(
	'weather',
	async ctx => {
		await ctx.reply('Enter your location in format "City, COUNTRY CODE"');
		return ctx.wizard.next();
	},
	locationHandler,
	rateHandler
);
