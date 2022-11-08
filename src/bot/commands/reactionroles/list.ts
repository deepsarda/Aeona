import Schema from '../../database/models/reactionRoles.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'list',
	description: 'See all the reaction roles.',
	commandType: ['application', 'message'],
	category: 'reactionroles',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const reactions = await Schema.find({ Guild: ctx.guildId });
		if (!reactions)
			return client.extras.errNormal(
				{
					error: `No data found!`,
					type: 'editreply',
				},
				ctx,
			);

		let list = ``;

		for (let i = 0; i < reactions.length; i++) {
			list += `**${i + 1}** - Category: ${reactions[i].Category} \n`;
		}

		await client.extras.embed(
			{
				title: '📃 Reaction roles',
				desc: list,
				type: 'editreply',
			},
			ctx,
		);
	},
};
