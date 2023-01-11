import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'invite',
	description: 'Invite me',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const row = new Components().addButton(
			'Invite me',
			'Link',
			'https://discord.com/api/oauth2/authorize?client_id=' + client.user.id + '&permissions=8&scope=bot',
		);

		client.extras.embed(
			{
				title: `Invite`,
				color: client.extras.config.colors.succes,
				components: row,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
