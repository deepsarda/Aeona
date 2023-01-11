import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'tickets',
	description: 'Setup tickets',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'category',
			description: 'Category for the channels',
			type: 'Channel',
			required: true,
		},
		{
			name: 'role',
			description: 'Role for the ticket',
			type: 'Role',
			required: true,
		},
		{
			name: 'channel',
			description: 'Channel',
			type: 'Channel',
			required: true,
		},
		{
			name: 'logs',
			description: 'The channel for the log',
			type: 'Channel',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const category = await ctx.options.getChannel('category', true);
		const role = await ctx.options.getRole('role', true);
		const channel = await ctx.options.getChannel('channel', true);
		const logs = await ctx.options.getChannel('logs', true);

		ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
			if (data) {
				data.Category = category.id;
				data.Role = role.id;
				data.Channel = channel.id;
				data.Logs = logs.id;
				data.save();
			} else {
				new ticketSchema({
					Guild: ctx.guild!.id,
					Category: category.id,
					Role: role.id,
					Channel: channel.id,
					Logs: logs.id,
				}).save();
			}
		});

		client.extras.succNormal(
			{
				text: `Tickets has been set up successfully!`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
