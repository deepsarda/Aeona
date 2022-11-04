import ticketSchema from '../../database/models/tickets.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'ticketpanel',
	description: 'Setup a ticket panel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		ticketSchema.findOne({ Guild: ctx.guildId }, async (err, ticketData) => {
			if (ticketData) {
				const channel = await client.helpers.getChannel(ticketData.Channel);
				const comp = new Components();
				comp.addButton('Tickets', 'Primary', 'openticket', {
					emoji: '🎫',
				});

				client.extras.embed(
					{
						title: 'Tickets',
						desc: 'Click on 🎫 to open a ticket',
						components: comp,
					},
					channel,
				);

				client.extras.succNormal(
					{
						text: `Ticket panel has been set up successfully!`,
						type: 'editreply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: `Run the ticket setup first!`,
						type: 'editreply',
					},
					ctx,
				);
			}
		});
	},
};
