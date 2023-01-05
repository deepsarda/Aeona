import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'bing',
	description: 'Search bing for information',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'text',
			description: 'the sentence to use',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const name = encodeURIComponent(ctx.options.getLongString('text', true));
		const link = `https://www.bing.com/search?q=${name}`;

		client.extras.succNormal(
			{
				text: `I have found the following for: \`${name}\``,
				fields: [
					{
						name: `→ Link`,
						value: `[Click here to see the link](${link})`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
