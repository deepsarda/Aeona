import Schema from '../../database/models/levels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'leaderboard',
	description: 'See the level leaderboard',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const rawLeaderboard = await Schema.find({ guildID: ctx.guildId })
			.sort([['xp', 'descending']])
			.exec();

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
				`**${rawLeaderboard.findIndex((i) => i.guildID === ctx.guildId && i.userID === e.userID) + 1}** | <@!${
					e.userID
				}> - Level: \`${e.level.toLocaleString()}\` (${e.xp.toLocaleString()} xp)`,
		);

		await client.extras.createLeaderboard(`Levels - ${ctx.guild.name}`, lb, ctx);
	},
};
