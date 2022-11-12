import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';
import ticketMessageConfig from '../../database/models/ticketMessage.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'createticket',
	description: 'Create a ticket',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [
		{
			name: 'reason',
			description: 'Reason for creation of a ticket',
			type: 'String',
			required: false,
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let reason = 'Not given';
		if (ctx.options) reason = ctx.options.getString('reason') || 'Not given';

		const type = 'reply';

		ticketChannels.findOne(
			{
				Guild: ctx.guildId,
				creator: ctx.user.id,
				resolved: false,
			},
			async (err, data) => {
				if (data) {
					return client.extras.errNormal(
						{
							error: 'Ticket limit reached. 1/1',
							type: 'ephemeral',
						},
						ctx,
					);
				} else {
					ticketSchema.findOne({ Guild: ctx.guildId }, async (err, TicketData) => {
						if (TicketData) {
							const logsChannel = await client.helpers.getChannel(TicketData.Logs);
							const ticketCategory = await client.helpers.getChannel(TicketData.Category);
							const ticketRoles = await client.helpers.getRoles(ctx.guildId);
							const role = ticketRoles.find((r) => r.id === TicketData.Role);

							try {
								let openTicket =
									'Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close ticket \n✋ - Claim ticket \n📝 - Save transcript \n🔔 - Send a notification';
								const ticketMessageData = await ticketMessageConfig.findOne({
									Guild: ctx.guildId,
								});
								if (ticketMessageData) {
									openTicket = ticketMessageData.openTicket;
								}
								const comp = new Components()
									.addButton('', 'Primary', 'closeticket', {
										emoji: '🔒',
									})
									.addButton('', 'Primary', 'claimTicket', {
										emoji: '✋',
									})
									.addButton('', 'Primary', 'transcriptTicket', {
										emoji: '📝',
									})
									.addButton('', 'Primary', 'noticeTicket', {
										emoji: '🔔',
									});

								client.extras
									.embed(
										{
											title: `${client.extras.emotes.animated.loading} Progress`,
											desc: `Your ticket is being created...`,
											type: 'ephemeral',
										},
										ctx,
									)
									.then(async (msg) => {
										if (TicketData.TicketCount) {
											TicketData.TicketCount += 1;
											TicketData.save();
										} else {
											TicketData.TicketCount = 1;
											TicketData.save();
										}

										if (ticketCategory == undefined) {
											return client.extras.errNormal(
												{
													error: 'Do the setup!',
													type: type,
												},
												ctx,
											);
										} else {
											const category = await client.helpers.getChannel(ticketCategory.id);

											const ticketid = String(TicketData.TicketCount).padStart(4, '0');
											await client.helpers
												.createChannel(ctx.guildId, {
													name: `ticket-${ticketid}`,
													permissionOverwrites: [
														{
															type: 0,
															deny: ['VIEW_CHANNEL'],
															id: ctx.guildId,
														},
														{
															type: 1,
															allow: [
																'VIEW_CHANNEL',
																'SEND_MESSAGES',
																'ATTACH_FILES',
																'READ_MESSAGE_HISTORY',
																'ADD_REACTIONS',
															],
															id: ctx.user.id,
														},
														{
															type: 0,
															allow: [
																'VIEW_CHANNEL',
																'SEND_MESSAGES',
																'ATTACH_FILES',
																'READ_MESSAGE_HISTORY',
																'ADD_REACTIONS',
															],
															id: role.id,
														},
													],
													parentId: category.id,
												})
												.then(async (channel) => {
													client.extras.embed(
														{
															title: `⚙️ System`,
															desc: `Ticket has been created`,
															fields: [
																{
																	name: '→ Creator',
																	value: `${ctx.user}`,
																	inline: true,
																},
																{
																	name: '→ Channel',
																	value: `<#${channel.id}>`,
																	inline: true,
																},
																{
																	name: '→ Created at',
																	value: `<t:${(Date.now() / 1000).toFixed(0)}:f>`,
																	inline: true,
																},
															],
															type: type,
														},
														ctx,
													);

													new ticketChannels({
														Guild: ctx.guildId,
														TicketID: ticketid,
														channelID: channel.id,
														creator: ctx.user.id,
														claimed: 'None',
													}).save();

													if (logsChannel) {
														client.extras.embed(
															{
																title: `📝 Open ticket`,
																desc: `A new ticket has been created`,
																fields: [
																	{
																		name: '→ Creator',
																		value: `${ctx.user.username + '#' + ctx.user.discriminator} (${ctx.user.id})`,
																		inline: false,
																	},
																	{
																		name: '→ Channel',
																		value: `${channel.name} is found at ${channel}`,
																		inline: false,
																	},
																	{
																		name: '→ Created at',
																		value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
																		inline: false,
																	},
																],
															},
															logsChannel,
														);
													}

													await client.extras.embed(
														{
															desc: openTicket,
															fields: [
																{
																	name: '→ Creator',
																	value: `${ctx.user}`,
																	inline: true,
																},
																{
																	name: '→ Subject',
																	value: `${reason}`,
																	inline: true,
																},
																{
																	name: '→ Created at',
																	value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
																	inline: true,
																},
															],
															components: comp,
															content: `${ctx.user}, <&${role.id}>`,
														},
														channel,
													);
												});
										}
									});
							} catch (err) {
								client.extras.errNormal(
									{
										error: 'Do the setup!',
										type: type,
									},
									ctx,
								);
								throw err;
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
			},
		);
	},
};
