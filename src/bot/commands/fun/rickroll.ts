import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'rickroll',
	description: 'Rickroll someone',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const roll = [
			'Never gonna give you up',
			'Never gonna let you down',
			'Never gonna run around and desert you',
			'Never gonna make you cry',
			'Never gonna say goodbye',
			'Never gonna tell a lie and hurt you',
		];
		const rick = roll[Math.floor(Math.random() * roll.length)];

		client.extras.embed(
			{
				title: `${rick}`,
				type: 'reply',
			},
			ctx,
		);
	},
};
