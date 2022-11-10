import Schema from '../../database/models/invites.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'show',
	description: 'Show details of a user',
	commandType: ['application', 'message'],
	category: 'invites',
	args: [
		{
			name: 'user',
			description: 'The user to show',
			required: false,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user = await ctx.options.getUser('user') || ctx.user;

		Schema.findOne(
			{ Guild: ctx.guildId, User: user.id },
			async (err: any, data: { Invites: any; Total: any; Left: any }) => {
				if (data) {
					client.extras.embed(
						{
							title: 'Invites',
							desc: `**${user.username + '#' + user.discriminator}** has \`${data.Invites}\` invites`,
							fields: [
								{
									name: 'Total',
									value: `${data.Total}`,
									inline: true,
								},
								{
									name: 'Left',
									value: `${data.Left}`,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				} else {
					client.extras.embed(
						{
							title: 'Invites',
							desc: `**${user.username + '#' + user.discriminator}** has \`0\` invites`,
							fields: [
								{
									name: 'Total',
									value: `0`,
									inline: true,
								},
								{
									name: 'Left',
									value: `0`,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				}
			},
		);
	},
};
