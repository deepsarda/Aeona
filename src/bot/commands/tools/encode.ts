import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'encode',
	description: 'Convert your text to binary format',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'text',
			description: 'the text to encode',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const text = ctx.options.getLongString('text', true);

		const encode = text
			.split('')
			.map((x) => x.charCodeAt(0).toString(2))
			.join(' ');

		client.extras.embed(
			{
				title: `Success!`,
				desc: `I converted text to binary text`,
				fields: [
					{
						name: 'Input',
						value: `\`\`\`${text}\`\`\``,
						inline: false,
					},
					{
						name: 'Output',
						value: `\`\`\`${encode}\`\`\``,
						inline: false,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
