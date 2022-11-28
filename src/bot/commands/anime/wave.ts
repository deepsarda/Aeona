import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'wave',
	description: 'wave to a user',
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const user = await ctx.options.getUser('user', true);
		client.extras.embed({
			title: `${ctx.user.username} waves to ${user.username}`,
			image: (await hmfull.HMtai.sfw.wave()).url,
		});
	},
};
