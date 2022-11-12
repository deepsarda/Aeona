import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'claim',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const data = await ticketSchema.findOne({ Guild: ctx.guildId });
		const ticketData = await ticketChannels.findOne({
			Guild: ctx.guildId,
			channelID: ctx.channel.id,
		});

		const type = 'reply';

		if (ticketData) {
			if (ctx.user.id + '' !== ticketData.creator) {
				if (data) {
					if (ticketData.claimed == '' || ticketData.claimed == undefined || ticketData.claimed == 'None') {
						const ticketCategory = await client.cache.channels.get(BigInt(data.Category));

						if (ticketCategory == undefined) {
							return client.extras.errNormal(
								{
									error: 'Do the ticket setup!',
									type: type,
								},
								ctx,
							);
						}

						if (ctx.channel.parentId == ticketCategory.id) {
							ticketData.claimed = ctx.user.id + '';
							ticketData.save();

							return client.extras.simpleEmbed(
								{
									desc: `You will now be assisted by <@!${ctx.user.id}>`,
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
						client.extras.errNormal(
							{
								error: 'Ticket has already been claimed!',
								type: 'ephemeral',
							},
							ctx,
						);
					}
				} else {
					return client.extras.errNormal(
						{
							error: 'Do the ticket setup!',
							type: type,
						},
						ctx,
					);
				}
			} else {
				return client.extras.errNormal(
					{
						error: 'You are not allowed to claim your own ticket!',
						type: 'ephemeral',
					},
					ctx,
				);
			}
		}
	},
};
