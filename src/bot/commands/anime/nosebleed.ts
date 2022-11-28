import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'nosebleed',
	description: "That's...impressive",
	commandType: ['application', 'message'],
	category: 'anime',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed({
			title: `${ctx.user.username}, that's...impressive`,
			image: (await hmfull.HMtai.sfw.nosebleed()).url,
		});
	},
};
