import Schema from '../../database/models/levelRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'rewards',
	description: 'See all the level rewards.',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const rawLeaderboard = await Schema.find({ Guild: ctx.guildId });

		if (rawLeaderboard.length < 1)
			return client.extras.errNormal(
				{
					error: `No rewards found!`,
					type: 'editreply',
				},
				ctx,
			);

		const lb = rawLeaderboard.map((e) => `**Level ${e.Level}** - <@&${e.Role}>`);

		await client.extras.createLeaderboard(`Level rewards - ${ctx.guild.name}`, lb, ctx);
	},
};
