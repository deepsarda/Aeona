import Schema from '../../database/models/messageRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'rewards',
	description: 'See all the rewards available',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const rawLeaderboard = await Schema.find({ Guild: ctx.guildId });

		if (rawLeaderboard.length < 1)
			return client.extras.errNormal(
				{
					error: `No rewards found!`,
					type: 'reply',
				},
				ctx,
			);

		const lb = rawLeaderboard.map((e) => `**${e.Messages} messages** - <@&${e.Role}>`);

		await client.extras.createLeaderboard(`Message rewards - ${ctx.guild.name}`, lb, ctx);
	},
};
