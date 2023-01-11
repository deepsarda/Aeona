import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'reverse',
	description: 'Reverse a string',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'text',
			description: 'The text to reverse',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const text = ctx.options.getString('text', true);
		if (!text) return;
		client.extras.succNormal(
			{
				text: `${text.split('').reverse().join('')}`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
