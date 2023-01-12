import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketMessageConfig from '../../database/models/ticketMessage.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

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
	private: true,
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let reason = 'Not given';
		if (ctx.options) reason = ctx.options.getString('reason') || 'Not given';

		const type = 'reply';

		ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, TicketData) => {
			if (TicketData) {
				const logsChannel = await client.helpers.getChannel(TicketData.Logs);
				const ticketCategory = await client.helpers.getChannel(TicketData.Category);
				const ticketRoles = await client.helpers.getRoles(ctx.guild!.id!);
				const role = ticketRoles.find((r) => r.id + '' === TicketData.Role);

				try {
					let openTicket =
						'Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close ticket \n✋ - Claim ticket \n📝 - Save transcript \n🔔 - Send a notification';
					const ticketMessageData = await ticketMessageConfig.findOne({
						Guild: ctx.guild!.id,
					});
					if (ticketMessageData) {
						openTicket = ticketMessageData.openTicket!;
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
							.createChannel(ctx.guild!.id!, {
								name: `ticket-${ticketid}`,
								permissionOverwrites: [
									{
										type: 0,
										deny: ['VIEW_CHANNEL'],
										id: ctx.guild!.id!,
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
										id: ctx.user!.id,
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
										id: role!.id,
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
												name: '<:members:1063116392762712116> Creator',
												value: `<@${ctx.user!.id}>`,
												inline: true,
											},
											{
												name: '<:channel:1049292166343688192> Channel',
												value: `<#${channel.id}>`,
												inline: true,
											},
											{
												name: '🕒 Created at',
												value: `<t:${(Date.now() / 1000).toFixed(0)}:f>`,
												inline: true,
											},
										],
										type: 'ephemeral'
									},
									ctx,
								);

								new ticketChannels({
									Guild: ctx.guild!.id + '',
									TicketID: ticketid,
									channelID: channel.id + '',
									creator: ctx.user!.id + '',
									claimed: 'None',
								}).save();

								if (logsChannel) {
									client.extras.embed(
										{
											title: `📝 Open ticket`,
											desc: `A new ticket has been created`,
											fields: [
												{
													name: '<:members:1063116392762712116> Creator',
													value: `${ctx.user!.username + '#' + ctx.user!.discriminator} (${ctx.user!.id})`,
													inline: false,
												},
												{
													name: '<:channel:1049292166343688192> Channel',
													value: `${channel.name} is found at <#${channel.id}>`,
													inline: false,
												},
												{
													name: '🕒 Created at',
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
												name: '<:members:1063116392762712116> Creator',
												value: `<@${ctx.user!.id}>`,
												inline: true,
											},
											{
												name: '💬 Subject',
												value: `${reason}`,
												inline: true,
											},
											{
												name: '🕒 Created at',
												value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
												inline: true,
											},
										],
										components: comp,
										content: `<@${ctx.user!.id}>, <@&${role!.id}>`,
									},
									channel,
								);
							});
					}

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
	},
} as CommandOptions;
