import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/blacklist.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'display',
	description: 'See all the blacklisted words',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
			if (data && data.Words.length > 0) {
				client.extras.embed(
					{
						title: '→ Blacklisted words 🤬 ',
						desc: data.Words.join(', '),
						type: 'reply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: `This guild has not data!`,
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
} as CommandOptions;
