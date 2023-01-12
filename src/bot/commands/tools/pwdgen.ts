import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import generator from 'generate-password';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'pwdgen',
	description: 'Generate a password',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const password = generator.generate({
			length: 12,
			symbols: true,
			numbers: true,
		});

		client.extras.succNormal(
			{
				text: `I have generated a password and have it sent to your DM`,
				type: 'reply',
			},
			ctx,
		);
		const channel = await client.helpers.getDmChannel(ctx.user.id);
		client.extras.succNormal(
			{
				text: `Your generated password`,
				fields: [
					{
						name: 'Password',
						value: `${password}`,
						inline: true,
					},
					{
						name: 'Length',
						value: `12`,
						inline: true,
					},
				],
				type: '',
			},
			channel,
		);
	},
} as CommandOptions;
