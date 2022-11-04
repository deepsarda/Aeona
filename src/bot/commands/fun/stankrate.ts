import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'stankrate',
	description: 'See your stank rate',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user',
			required: false,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const result = Math.ceil(Math.random() * 100);

		client.extras.embed(
			{
				title: `Stank rate`,
				desc: `You are ${result}% stanky!`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
