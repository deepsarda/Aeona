import Schema from '../../database/models/votecredits.js';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'news',
	description: 'Get the lastest news about Aeona',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let user = await Schema.findOne({ User: ctx.user.id });
		if (!user) user = new Schema({ User: ctx.user.id });
		user.LastVersion = client.extras.version;
		user.save();

		client.extras.embed(
			{
				title: `Changelog for ${client.extras.version}`,
				desc: `Hello there <a:wave:1049348090244636683>, I have upgraded my AI.`,
				fields: [
					{
						name: '→ :frame_photo: AI Image Generator',
						value: `We now generate higher resolution photos but slower. \n The images should now be much more accurate to your prompt. \n Along with a ability to share your art.`,
						inline: true,
					},
					{
						name: '→  Several bugs lost thier life.',
						value: `Different commands work much faster.`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
