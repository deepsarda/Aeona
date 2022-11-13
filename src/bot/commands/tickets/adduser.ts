import ticketSchema from '../../database/models/tickets.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'adduser',
	description: 'Add user to the ticket',
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
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const data = await ticketSchema.findOne({ Guild: ctx.guildId });

		if (data) {
			const ticketCategory = await client.cache.channels.get(BigInt(data.Category));
			if (ticketCategory == undefined) {
				return client.extras.errNormal(
					{
						error: 'Do the ticket setup!',
						type: 'editreply',
					},
					ctx,
				);
			}

			if (ctx.channel.parentId == ticketCategory.id) {
				const user = await ctx.options.getUser('user', true);
				client.helpers.editChannel(ctx.channel.parentId, {
					permissionOverwrites: [
						{
							type: 1,
							id: user.id,
							allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
						},
					],
				});

				return client.extras.simpleEmbed(
					{
						desc: `Added ${user}`,
						type: 'editreply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: 'This is not a ticket!',
						type: 'editreply',
					},
					ctx,
				);
			}
		}
	},
};
