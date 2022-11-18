import sourcebin from 'sourcebin';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'sourcebin',
	description: 'Create a sourcebin file',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'language',
			description: 'the codes language',
			required: true,
			type: 'String',
		},
		{
			name: 'code',
			description: 'the code to upload',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const language = ctx.options.getString('language', true);
		const code = ctx.options.getLongString('code', true);

		const bin = await sourcebin
			.create({
				title: 'Random Code',
				description: 'This is code was uploaded via Aeona',
				files: [
					{
						content: `${code}`,
						language: `${language}`,
					},
				],
			})
			.then((value) => {
				client.extras.succNormal(
					{
						text: `Your code has been posted!`,
						fields: [
							{
								name: `→ Link`,
								value: `[Click here to see your code](${value.url})`,
								inline: true,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
