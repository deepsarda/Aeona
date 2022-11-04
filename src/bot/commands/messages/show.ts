import Schema from '../../database/models/messages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user = ctx.options.getUser('user') || ctx.user;

		Schema.findOne({ Guild: ctx.guildId, User: user.id }, async (err: any, data: { Messages: any }) => {
			if (data) {
				client.extras.embed(
					{
						title: 'Messages',
						desc: `**${user.username + '#' + user.discriminator}** has \`${data.Messages}\` messages`,
						type: 'editreply',
					},
					ctx,
				);
			} else {
				client.extras.embed(
					{
						title: 'Messages',
						desc: `**${user.username + '#' + user.discriminator}** has \`0\` messages`,
						type: 'editreply',
					},
					ctx,
				);
			}
		});
	},
};
