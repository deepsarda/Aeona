import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'epicgamerrate',
	description: 'See how much of a epic gamer are you',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user to hack',
			required: false,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const result = Math.ceil(Math.random() * 100);

		client.extras.embed(
			{
				title: `Epic gamer rate`,
				desc: `You are ${result}% epic gamer!`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
