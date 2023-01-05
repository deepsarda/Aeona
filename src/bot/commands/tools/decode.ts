import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'decode',
	description: 'Decode text from binary format',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'code',
			description: 'the text to decode',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const code = ctx.options.getLongString('code', true);

		if (isNaN(parseInt(code)))
			return client.extras.errNormal(
				{
					error: `You can only decode binary code!`,
					type: 'reply',
				},
				ctx,
			);

		const decode = code
			.split(' ')
			.map((bin) => String.fromCharCode(parseInt(bin, 2)))
			.join('');

		client.extras.embed(
			{
				title: `Success!`,
				desc: `I have decoded code`,
				fields: [
					{
						name: '📥 - Input',
						value: `\`\`\`${code}\`\`\``,
						inline: false,
					},
					{
						name: '📥 - Output',
						value: `\`\`\`${decode}\`\`\``,
						inline: false,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
