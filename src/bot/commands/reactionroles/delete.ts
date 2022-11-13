import Schema from '../../database/models/reactionRoles.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'delete',
	description: 'Delete a reaction role.',
	commandType: ['application', 'message'],
	category: 'reactionroles',
	args: [
		{
			name: 'category',
			description: 'The category of the reaction roles',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_ROLES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const category = ctx.options.getString('category', true);

		Schema.findOne({ Guild: ctx.guildId, Category: category }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: `No data found!`,
						type: 'reply',
					},
					ctx,
				);

			const remove = await Schema.deleteOne({
				Guild: ctx.guildId,
				Category: category,
			});

			client.extras.succNormal(
				{
					text: `**${category}** successfully deleted!`,
					type: 'reply',
				},
				ctx,
			);
		});
	},
};
