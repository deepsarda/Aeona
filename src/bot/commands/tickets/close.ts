import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';
import ticketMessageConfig from '../../database/models/ticketMessage.js';

import { AmethystBot, Context, Components } from '@thereallonewolf/amethystframework';
export default {
	name: 'close',
	description: 'Close the ticket',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const data = await ticketSchema.findOne({ Guild: ctx.guildId });
		const ticketData = await ticketChannels.findOne({
			Guild: ctx.guildId,
			channelID: ctx.channel.id,
		});

		const type = 'reply';

		if (ticketData) {
			if (ticketData.resolved == true)
				return client.extras.errNormal(
					{
						error: 'Ticket is already closed!',
						type: 'ephemeral',
					},
					ctx,
				);

			if (data) {
				const ticketCategory = await client.cache.channels.get(BigInt(data.Category));
				const logsChannel = await client.cache.channels.get(BigInt(data.Logs));

				if (ticketCategory == undefined) {
					return client.extras.errNormal(
						{
							error: 'Do the setup!',
							type: type,
						},
						ctx,
					);
				}
				client.helpers.editChannel(ctx.channel.id, {
					permissionOverwrites: [
						{
							type: 1,
							id: BigInt(ticketData.creator),
							allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
						},
					],
				});

				try {
					let closeMessageTicket =
						'Here is the transcript for your ticket, please keep this if you ever want to refer to it!';
					const ticketMessageData = await ticketMessageConfig.findOne({
						Guild: ctx.guildId,
					});
					if (ticketMessageData) {
						closeMessageTicket = ticketMessageData.dmMessage;
					}

					client.extras.embed(
						{
							desc: closeMessageTicket,
							fields: [
								{
									name: '→ Closer',
									value: `${ctx.user}`,
									inline: true,
								},
								{
									name: '→ Ticket id',
									value: `${ticketData.TicketID}`,
									inline: true,
								},
								{
									name: '→ Server',
									value: `${ctx.guild.name}`,
									inline: true,
								},
							],
						},
						{ id: BigInt(ticketData.creator) },
					);
					client.extras.transcript(client, { id: BigInt(ticketData.creator) }).catch();
				} catch (err) {
					//Fix lint error
				}

				if (logsChannel) {
					client.extras.embed(
						{
							title: `🔒 Ticket closed`,
							desc: `Ticket is closed`,
							color: client.extras.config.colors.error,
							fields: [
								{
									name: '→ Ticket id',
									value: `${ticketData.TicketID}`,
								},
								{
									name: '→ Closer',
									value: `${ctx.user.username + '#' + ctx.user.discriminator} (${ctx.user.id})`,
								},
								{
									name: '→ Creator',
									value: `<@!${ticketData.creator}>`,
								},
								{
									name: '→ Claimed by',
									value: `<@!${ticketData.creator}>`,
								},
								{
									name: '→ Date',
									value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
								},
							],
						},
						logsChannel,
					);
					client.extras.transcript(client, logsChannel);
				}

				ticketData.resolved = true;
				ticketData.save();

				client.extras.simpleEmbed(
					{
						desc: `Ticket closed by <@!${ctx.user.id}>`,
						type: type,
					},
					ctx,
				);
				const comp = new Components();
				comp
					.addButton('', 'Primary', 'transcriptTicket', {
						emoji: '📝',
					})
					.addButton('', 'Primary', 'openTicket', {
						emoji: '🔓',
					})
					.addButton('', 'Danger', 'deleteTicket', {
						emoji: '⛔',
					});

				client.extras.embed(
					{
						title: '🔒 Closed',
						desc: `📝 - Save transcript \n🔓 - Reopen ticket \n⛔ - Delete ticket`,
						components: comp,
					},
					ctx.channel,
				);
			} else {
				return client.extras.errNormal(
					{
						error: 'Do the ticket setup!',
						type: type,
					},
					ctx,
				);
			}
		}
	},
};
