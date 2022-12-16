import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import hmfull from 'hmfull';
export default {
	name: 'sleep',
	description: 'Zzz 💤',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed(
			{
				title: `Shh! ${ctx.user.username} is asleep`,
				image: (await hmfull.HMtai.sfw.sleep()).url,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
