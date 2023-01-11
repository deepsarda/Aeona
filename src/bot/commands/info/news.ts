import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/votecredits.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'news',
	description: 'Get the lastest news about Aeona',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let user = await Schema.findOne({ User: ctx.user.id });
		if (!user) user = new Schema({ User: ctx.user.id });
		user.LastVersion = client.extras.version;
		user.save();

		client.extras.embed(
			{
				title: `Changelog for ${client.extras.version}`,
				desc: `Hello there <a:wave:1049348090244636683>, while you where gone I have been updated. \n I have gone around and fixed several command and improved the look and feel of several other commands. \n Things should run much smoother and with lesser downtime.`,

				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
