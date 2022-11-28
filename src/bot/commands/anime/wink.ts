import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'wink',
	description: 'Wink',
	commandType: ['application', 'message'],
	category: 'anime',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed(
			{
				title: `${ctx.user.username} winks`,
				image: (await hmfull.HMtai.sfw.wink()).url,
				type: 'reply',
			},
			ctx,
		);
	},
};
