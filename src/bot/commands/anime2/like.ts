import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'like',
	description: 'I like it, nice 👍',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		client.extras.embed(
			{
				title: `${ctx.user.username} likes that`,
				image: (await hmfull.HMtai.sfw.like()).url,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
