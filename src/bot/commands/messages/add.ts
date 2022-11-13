import Schema from '../../database/models/messages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const user = await ctx.options.getUser('user', true);
		const amount = ctx.options.getNumber('amount', true);

		const data = await Schema.findOne({
			Guild: ctx.guildId,
			User: user.id + '',
		});
		if (data) {
			data.Messages += amount;
			await data.save();
		} else {
			await new Schema({
				Guild: ctx.guildId,
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
						value: `${data.Messages}`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
