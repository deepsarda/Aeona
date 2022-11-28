import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'dance',
	description: 'Move like lady jagger ヾ(≧▽≦*)o',
	commandType: ['application', 'message'],
	category: 'anime',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed({
			title: `${ctx.user.username} dances`,
			image: (await hmfull.HMtai.sfw.dance()).url,
		});
	},
};
