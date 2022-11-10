import Schema from '../../database/models/invites.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'leaderboard',
	description: 'See the invite leaderboard',
	commandType: ['application', 'message'],
	category: 'invites',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const rawLeaderboard = await Schema.find({
			Guild: ctx.guildId,
		}).sort([['Invites', 'descending']]);

		if (!rawLeaderboard)
			return client.extras.errNormal(
				{
					error: `No data found!`,
					type: 'reply',
				},
				ctx,
			);

		const lb = rawLeaderboard.map(
			(e) =>
				`**${rawLeaderboard.findIndex((i) => i.Guild === ctx.guildId && i.User === e.User) + 1}** | <@!${
					e.User
				}> - Invites: \`${e.Invites}\``,
		);

		await client.extras.createLeaderboard(`Invites - ${ctx.guild.name}`, lb, ctx);
	},
};
