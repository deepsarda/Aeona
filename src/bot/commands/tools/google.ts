import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'google',
	description: 'Get results from google',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'text',
			description: 'the sentence to search for',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const name = encodeURIComponent(ctx.options.getLongString('text', true));
		const link = `https://www.google.com/search?q=${name}`;

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
				type: 'editreply',
			},
			ctx,
		);
	},
};
