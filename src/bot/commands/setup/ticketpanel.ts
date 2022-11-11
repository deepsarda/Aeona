import ticketSchema from '../../database/models/tickets.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'ticketpanel',
	description: 'Set up the tickets',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'name',
			description: 'Ticket name',
			type: 'String',
			required: true,
		},
		{
			name: 'description',
			description: 'The description for the embed',
			type: 'String',
			required: true,
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const name = ctx.options.getString('name', true);
		const description = ctx.options.getString('description', true);

		ticketSchema.findOne({ Guild: ctx.guildId }, async (err, ticketData) => {
			if (ticketData) {
				const channel = await client.helpers.getChannel(ticketData.Channel);
				const comp = new Components();
				comp.addButton(name, 'Primary', 'openticket', { emoji: '🎫' });

				client.extras.embed(
					{
						title: name,
						desc: description,
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
