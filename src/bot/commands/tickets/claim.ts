import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'claim',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const data = await ticketSchema.findOne({ Guild: ctx.guild!.id });
		const ticketData = await ticketChannels.findOne({
			Guild: ctx.guild!.id,
			channelID: ctx.channel.id,
		});

		const type = 'reply';

		if (ticketData) {
			if (ctx.user.id + '' !== ticketData.creator) {
				if (data) {
					if (ticketData.claimed == '' || ticketData.claimed == undefined || ticketData.claimed == 'None') {
						const ticketCategory = await client.helpers.getChannel(BigInt(data.Category!));

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
} as CommandOptions;
