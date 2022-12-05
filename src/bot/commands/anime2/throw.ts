import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'throw',
	description: 'YEEEEEEEEEEET',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [
		{
			name: 'user',
			description: 'The User',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await ctx.options.getUser('user', true);
		client.extras.embed(
			{
				title: `${ctx.user.username} throws ${user.username}`,
				image: (await hmfull.HMtai.sfw.wave()).url,
				type: 'reply',
			},
			ctx,
		);
	},
};
