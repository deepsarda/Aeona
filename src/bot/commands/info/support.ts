import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'support',
	description: 'Join the support server',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const row = new Components().addButton('join', 'Link', client.extras.config.discord.serverInvite);
		client.extras.embed(
			{
				title: `Support`,
				desc: `Join the support server.`,
				url: client.extras.config.discord.serverInvite,
				components: row,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
