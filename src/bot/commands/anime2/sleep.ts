import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'sleep',
	description: 'Zzz 💤',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

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
