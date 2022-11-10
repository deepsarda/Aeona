import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'lovemeter',
	description: 'Get the love between two users.',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user',
			required: true,
			type: 'String',
		},
		{
			name: 'user1',
			description: 'The user',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user1 = await ctx.options.getUser('user1', true);
		const user2 = await ctx.options.getUser('user2', true);

		if (user1 == user2)
			return client.extras.errNormal({ error: 'You cannot give 2 of the same names!', type: 'edit' }, ctx);

		const result = Math.ceil(Math.random() * 100);

		client.extras.embed(
			{
				title: `Love meter`,
				desc: 'See how much you match!',
				fields: [
					{
						name: 'Name 1',
						value: `${user1}`,
						inline: true,
					},
					{
						name: 'Name 2',
						value: `${user2}`,
						inline: true,
					},
					{
						name: 'Result',
						value: `**${user2}** and **${user2}** match **${result}%**`,
						inline: false,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
