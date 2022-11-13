import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'transcript',
	description: 'Generate a transcript of this chat',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const type = 'reply';

		ticketChannels.findOne({ Guild: ctx.guildId, channelID: ctx.channel.id }, async (err, ticketData) => {
			if (ticketData) {
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
							return client.extras
								.simpleEmbed(
									{
										desc: `${client.extras.emotes.animated.loading} Transcript saving...`,
										type: type,
									},
									ctx,
								)
								.then(async (editMsg) => {
									client.extras.transcript(client, ctx.channel).then(() => {
										return client.extras.simpleEmbed(
											{
												desc: `Transcript saved`,
												type: 'editreply',
											},
											ctx,
										);
									});
								});
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
