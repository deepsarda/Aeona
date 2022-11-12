import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'notice',
	description: 'Send a inactivity notification.',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const type = 'reply';

		ticketChannels.findOne({ Guild: ctx.guildId, channelID: ctx.channel.id }, async (err, ticketData) => {
			if (ticketData) {
				if (ctx.user.id !== ticketData.creator) {
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
								client.extras.simpleEmbed(
									{
										desc: `Hey <@!${ticketData.creator}>, \n\nCan we still help you? \nIf there is no response within **24 hours**, we will close this ticket \n\n- Team ${ctx.guild.name}`,
										content: `<@!${ticketData.creator}>`,
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
				} else {
					return client.extras.errNormal(
						{
							error: 'You are not allowed to notice your own ticket!',
							type: 'ephemeral',
						},
						ctx,
					);
				}
			}
		});
	},
};
