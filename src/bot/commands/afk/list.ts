import Schema from '../../database/models/afk.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'list',
	description: 'Show all afk users',
	commandType: ['application', 'message'],
	category: 'afk',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const rawboard = await Schema.find({ Guild: ctx.guildId });

		if (rawboard.length < 1)
			return client.extras.errNormal(
				{
					error: 'No data found!',
					type: 'reply',
				},
				ctx,
			);

		const lb = rawboard.map((e) => `<@!${e.User}> - **Reason** ${e.Message}`);

		await client.extras.createLeaderboard(`AFK users - ${ctx.guild?.name}`, lb, ctx);
	},
};
