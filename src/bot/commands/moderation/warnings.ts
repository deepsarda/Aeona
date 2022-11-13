import Schema from '../../database/models/warnings.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'warnings',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to see warnings of.',
			required: true,
			type: 'User',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const member = await ctx.options.getUser('user', true);

		Schema.findOne({ Guild: ctx.guildId, User: member.id }, async (err: any, data: { Warns: any }) => {
			if (data) {
				client.extras.embed(
					{
						title: `Warnings`,
						desc: `The warnings of **${member.username + '#' + member.discriminator}**`,
						fields: [
							{
								name: 'Total',
								value: `${data.Warns}`,
								inline: false,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			} else {
				client.extras.embed(
					{
						title: `Warnings`,
						desc: `The warnings of **${member.username + '#' + member.discriminator}**`,
						fields: [
							{
								name: 'Total',
								value: '0',
								inline: false,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
};
