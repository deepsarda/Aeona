import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/messages.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'show',
	description: 'See number of messages you have',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [
		{
			name: 'user',
			description: 'the user',
			required: false,
			type: 'User',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user = (await ctx.options.getUser('user')) || ctx.user;

		Schema.findOne({ Guild: ctx.guild!.id, User: user.id }, async (err: any, data: { Messages: any }) => {
			if (data) {
				client.extras.embed(
					{
						title: 'Messages',
						desc: `**${user.username + '#' + user.discriminator}** has \`${data.Messages}\` messages`,
						type: 'reply',
					},
					ctx,
				);
			} else {
				client.extras.embed(
					{
						title: 'Messages',
						desc: `**${user.username + '#' + user.discriminator}** has \`0\` messages`,
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
} as CommandOptions;
