import Schema from '../../database/models/invites.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'add',
	description: 'add invites to a user',
	commandType: ['application', 'message'],
	category: 'invites',
	args: [
		{
			name: 'user',
			description: 'The user you want to add invites to',
			required: true,
			type: 'User',
		},
		{
			name: 'amount',
			description: 'How many invites to add',
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
			User: user?.id + '',
		});
		if (data) {
			data.Invites! += amount;
			data.Total! += amount;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guild!.id,
				User: user?.id + '',
				Invites: amount,
				Total: amount,
				Left: 0,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Added **${amount}** invites to ${user}`,
				fields: [
					{
						name: '→ Total invites',
						value: `${data!.Invites}`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
