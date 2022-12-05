import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'threaten',
	description: 'Rrrr',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed(
			{
				title: `${ctx.user.username} warns you`,
				image: (await hmfull.HMtai.sfw.threaten()).url,
				type: 'reply',
			},
			ctx,
		);
	},
};
