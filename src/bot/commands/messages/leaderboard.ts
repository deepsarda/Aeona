import Schema from '../../database/models/messages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'leaderboard',
	description: 'See the leaderboard',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const rawLeaderboard = await Schema.find({
			Guild: ctx.guildId,
		}).sort([['Messages', 'descending']]);

		if (!rawLeaderboard)
			return client.extras.errNormal(
				{
					error: `No data found!`,
					type: 'editreply',
				},
				ctx,
			);

		const lb = rawLeaderboard.map(
			(e) =>
				`**${rawLeaderboard.findIndex((i) => i.Guild === ctx.guildId && i.User === e.User) + 1}** | <@!${
					e.User
				}> - Messages: \`${e.Messages}\``,
		);

		await client.extras.createLeaderboard(`Messages - ${ctx.guild.name}`, lb, ctx);
	},
};
