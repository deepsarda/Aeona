import Schema from '../../database/models/messages.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'leaderboard',
	description: 'See the leaderboard',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const rawLeaderboard = await Schema.find({
			Guild: ctx.guild!.id,
		}).sort([['Messages', 'descending']]);

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
				`**${rawLeaderboard.findIndex((i) => i.Guild === ctx.guild!.id + '' && i.User === e.User) + 1}** | <@!${
					e.User
				}> - Messages: \`${e.Messages}\``,
		);
		try {
			await client.extras.createLeaderboard(`Messages - ${ctx.guild.name}`, lb, ctx);
		} catch (err) {
			console.error(err);
		}
	},
} as CommandOptions;
