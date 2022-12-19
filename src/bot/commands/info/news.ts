import Schema from '../../database/models/votecredits.js';
import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'news',
	description: 'Get the lastest news about Aeona',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let user = await Schema.findOne({ User: ctx.user.id });
		if (!user) user = new Schema({ User: ctx.user.id });
		user.LastVersion = client.extras.version;
		user.save();

		client.extras.embed(
			{
				title: `Changelog for ${client.extras.version}`,
				desc: `Hello there <a:wave:1049348090244636683>.`,
				fields: [
					{
						name: '→ :frame_photo: AI Image Generator',
						value: `The AI GENERATION is much much much greater.`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
