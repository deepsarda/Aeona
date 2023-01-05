import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'mcskin',
	description: 'Get minecraft skin of a player',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'name',
			description: 'the player to search for',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const name = ctx.options.getString('name', true);

		if (name == null) return client.extras.errUsage({ usage: 'mcskin [player name]', type: 'reply' }, ctx);

		client.extras.embed(
			{
				title: `🎮 Skin of ${name}`,
				image: `https://minotar.net/armor/body/${name}/700.png`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
