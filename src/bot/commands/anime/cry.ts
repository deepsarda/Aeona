import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import hmfull from 'hmfull';
export default {
	name: 'cry',
	description: 'cry',
	commandType: ['application', 'message'],
	category: 'anime',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed(
			{
				title: `${ctx.user.username} cries`,
				image: (await hmfull.HMtai.sfw.cry()).url,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
