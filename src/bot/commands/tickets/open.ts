import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'open',
	description: 'Open a closed ticket',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const type = 'reply';

		ticketChannels.findOne({ Guild: ctx.guildId, channelID: ctx.channel.id }, async (err, ticketData) => {
			if (ticketData) {
				if (ticketData.resolved == false)
					return client.extras.errNormal(
						{
							error: 'Ticket is already open!',
							type: 'ephemeraledit',
						},
						ctx,
					);

				ticketSchema.findOne({ Guild: ctx.guildId }, async (err, data) => {
					if (data) {
						const ticketCategory = await client.helpers.getChannel(data.Category);

						if (ticketCategory == undefined) {
							return client.extras.errNormal(
								{
									error: 'Do the setup!',
									type: type,
								},
								ctx,
							);
						}

						if (ctx.channel.parentId == ticketCategory.id) {
							client.helpers.editChannel(ctx.channel.id, {
								permissionOverwrites: [
									{
										type: 1,
										id: BigInt(ticketData.creator),
										deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
									},
								],
							});

							const ticketid = String(ticketData.TicketID).padStart(4, '0');

							client.helpers.editChannel(ctx.channel.id, {
								name: `ticket-${ticketid}`,
							});

							ticketData.resolved = false;
							ticketData.save();

							return client.extras.simpleEmbed(
								{
									desc: `Ticket opened by <@!${ctx.user.id}>`,
									type: type,
								},
								ctx,
							);
						} else {
							client.extras.errNormal(
								{
									error: 'This is not a ticket!',
									type: type,
								},
								ctx,
							);
						}
					} else {
						return client.extras.errNormal(
							{
								error: 'Do the setup!',
								type: type,
							},
							ctx,
						);
					}
				});
			}
		});
	},
};
