import Schema from '../../database/models/blacklist.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'display',
	description: 'See all the blacklisted words',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
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
};
