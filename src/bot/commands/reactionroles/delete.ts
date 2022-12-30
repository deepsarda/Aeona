import Schema from '../../database/models/reactionRoles.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'delete',
	description: 'Delete a reaction role.',
	commandType: ['application', 'message'],
	category: 'reactionroles',
	args: [
		{
			name: 'name',
			description: 'The name of the reaction roles',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_ROLES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const category = ctx.options.getString('name', true);

		Schema.findOne({ Guild: ctx.guild!.id, Category: category }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: `No data found!`,
						type: 'reply',
					},
					ctx,
				);

			await Schema.deleteOne({
				Guild: ctx.guild!.id,
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
} as CommandOptions;
