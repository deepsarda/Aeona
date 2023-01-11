import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'removeuser',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [
		{
			name: 'user',
			description: 'User to add to the ticket',
			required: true,
			type: 'User',
		},
	],

	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const data = await ticketSchema.findOne({ Guild: ctx.guild!.id });
		const ticketData = await ticketChannels.findOne({
			Guild: ctx.guild!.id,
			channelID: ctx.channel.id,
		});

		if (data) {
			const ticketCategory = await client.helpers.getChannel(data.Category!);
			if (ticketCategory == undefined) {
				return client.extras.errNormal(
					{
						error: 'Do the ticket setup!',
						type: 'reply',
					},
					ctx,
				);
			}

			if (ctx.channel.parentId == ticketCategory.id) {
				const user = await ctx.options.getUser('user', true);
				if (ticketData && user.id + '' == ticketData.creator) {
					return client.extras.errNormal(
						{
							error: 'You cannot remove the ticket maker from this ticket',
							type: 'ephemeral',
						},
						ctx,
					);
				}
				client.helpers.editChannel(ctx.channel.id, {
					permissionOverwrites: [
						{
							type: 1,
							id: BigInt(user.id),
							deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
						},
					],
				});

				return client.extras.simpleEmbed(
					{
						desc: `Removed <@${user.id}>`,
						type: 'reply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: 'This is not a ticket!',
						type: 'reply',
					},
					ctx,
				);
			}
		}
	},
} as CommandOptions;
