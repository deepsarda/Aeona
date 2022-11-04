import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'gayrate',
	description: 'See you gay you are.',
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
				title: `Gay rate`,
				desc: `You are ${result}% gay!`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
