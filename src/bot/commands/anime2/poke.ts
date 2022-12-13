import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'poke',
	description: 'Poke-poke :P',
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
				title: `${ctx.user.username} pokes ${user.username}`,
				image: (await hmfull.HMtai.sfw.poke()).url,
				type: 'reply',
			},
			ctx,
		);
	},
};