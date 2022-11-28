import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'sleep',
	description: 'Zzz 💤',
	commandType: ['application', 'message'],
	category: 'anime',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed({
			title: `Shh! ${ctx.user.username} is asleep`,
			image: (await hmfull.HMtai.sfw.sleep()).url,
		});
	},
};
