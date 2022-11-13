import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'unclaim',
	description: 'Remove you claim from this ticket.',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const data = await ticketSchema.findOne({ Guild: ctx.guildId });
		const ticketData = await ticketChannels.findOne({
			Guild: ctx.guildId,
			channelID: ctx.channel.id,
		});

		if (ticketData) {
			if (ctx.user.id + '' !== ticketData.creator) {
				if (data) {
					if (ticketData.claimed == '' || ticketData.claimed == undefined || ticketData.claimed == 'None') {
						client.extras.errNormal(
							{
								text: 'Ticket not claimed!',
								type: 'ephemeral',
							},
							ctx,
						);
					} else {
						if (ticketData.claimed == ctx.user.id + '') {
							const ticketCategory = await client.helpers.getChannel(data.Category);

							if (ticketCategory == undefined) {
								return client.extras.errNormal(
									{
										error: 'Do the setup!',
										type: 'editreply',
									},
									ctx,
								);
							}

							if (ctx.channel.parentId == ticketCategory.id) {
								ticketData.claimed = 'None';
								ticketData.save();

								return client.extras.simpleEmbed(
									{
										desc: `This ticket can now be claimed again!`,
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
						} else {
							client.extras.errNormal(
								{
									error: 'You have not claimed this ticket!',
									type: 'editreply',
								},
								ctx,
							);
						}
					}
				} else {
					return client.extras.errNormal(
						{
							error: 'Do the ticket setup!',
							type: 'editreply',
						},
						ctx,
					);
				}
			}
		}
	},
};
