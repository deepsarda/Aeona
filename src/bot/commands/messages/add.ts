import Schema from '../../database/models/messages.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'add',
	description: 'Add messages to a user',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [
		{
			name: 'user',
			description: 'The user you want to add messages to',
			required: true,
			type: 'User',
		},
		{
			name: 'amount',
			description: 'How many messages to add',
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
			data.Messages += amount;
			await data.save();
		} else {
			await new Schema({
				Guild: ctx.guild!.id,
				User: user.id + '',
				Messages: amount,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Added **${amount}** messages to ${user}`,
				fields: [
					{
						name: '→ Total messages',
						value: `${data!.Messages}`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
