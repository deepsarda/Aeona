import Schema from '../../database/models/messages.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
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
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await ctx.options.getUser('user', true);
		const amount = ctx.options.getNumber('amount', true);

		const data = await Schema.findOne({
			Guild: ctx.guild!.id,
			User: user.id + '',
		});
		if (data) {
			if (!data.Messages) data.Messages = 0;
			data.Messages -= amount;
			await data.save();
		} else {
			return client.extras.errNormal(
				{
					error: `No message data found for ${user}`,
					type: 'reply',
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
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
