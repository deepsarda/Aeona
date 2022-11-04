import Schema from '../../database/models/messages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'remove',
	description: 'Remove ',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [
		{
			name: 'user',
			description: 'The user you want to remove messages from',
			required: true,
			type: 'User',
		},
		{
			name: 'amount',
			description: 'How many messages to remove',
			required: true,
			type: 'Number',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user = ctx.options.getUser('user', true);
		const amount = ctx.options.getNumber('amount', true);

		const data = await Schema.findOne({
			Guild: ctx.guildId,
			User: user.id,
		});
		if (data) {
			data.Messages -= amount;
			await data.save();
		} else {
			return client.extras.errNormal(
				{
					error: `No message data found for ${user}`,
					type: 'editreply',
				},
				ctx,
			);
		}

		client.extras.succNormal(
			{
				text: `Removed **${amount}** messages from ${user}`,
				fields: [
					{
						name: '→ Total messages',
						value: `${data.Messages}`,
						inline: true,
					},
				],
				type: 'editreply',
			},
			ctx,
		);
	},
};
