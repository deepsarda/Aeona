import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import hmfull from 'hmfull';
export default {
	name: 'feed',
	description: 'Who want eat? :P',
	commandType: ['application', 'message'],
	category: 'anime',
	args: [
		{
			name: 'user',
			description: 'The User',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await ctx.options.getUser('user', true);
		client.extras.embed(
			{
				title: `${ctx.user.username} feeds ${user.username}`,
				image: (await hmfull.HMtai.sfw.feed()).url,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
