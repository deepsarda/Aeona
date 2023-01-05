import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/stickymessages.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'messages',
	description: 'See all the sticky messages of the server',
	commandType: ['application', 'message'],
	category: 'stickymessages',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const data = await Schema.find({ Guild: ctx.guild!.id });

		if (data) {
			let list = ``;

			for (let i = 0; i < data.length; i++) {
				list += `**${i + 1}** - Channel: ${data[i].Channel}`;
			}

			await client.extras.embed(
				{
					title: `Sticky messages`,
					desc: list,
					type: 'reply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal(
				{
					error: 'No data found!',
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
