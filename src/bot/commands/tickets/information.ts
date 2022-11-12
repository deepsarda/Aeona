import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'information',
	description: 'Gain info about this ticket.',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		ticketChannels.findOne({ Guild: ctx.guildId, channelID: ctx.channel.id }, async (err, ticketData) => {
			if (ticketData) {
				ticketSchema.findOne({ Guild: ctx.guildId }, async (err, data) => {
					if (data) {
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
							client.extras
								.embed(
									{
										desc: `${client.extras.emotes.animated.loading} Loading information...`,
										type: 'editreply',
									},
									ctx,
								)
								.then((msg) => {
									client.extras.transcript(client, ctx.channel);

									return client.extras.embed(
										{
											title: `ℹ Information`,
											fields: [
												{
													name: 'Ticket name',
													value: `\`${ctx.channel.name}\``,
													inline: true,
												},
												{
													name: 'Channel id',
													value: `\`${ctx.channel.id}\``,
													inline: true,
												},
												{
													name: 'Creator',
													value: `<@!${ticketData.creator}>`,
													inline: true,
												},
												{
													name: 'Claimed by',
													value: `<@!${ticketData.claimed}>`,
													inline: true,
												},
												{
													name: 'Ticket id',
													value: `${ticketData.TicketID}`,
													inline: true,
												},
											],
											type: 'editreply',
										},
										msg,
									);
								});
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
						return client.extras.errNormal(
							{
								error: 'Do the setup!',
								type: 'editreply',
							},
							ctx,
						);
					}
				});
			}
		});
	},
};
