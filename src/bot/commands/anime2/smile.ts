import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';
export default {
	name: 'smile',
	description: 'Smile',
	commandType: ['application', 'message'],
	category: 'anime2',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		client.extras.embed(
			{
				title: `${ctx.user.username} smiles`,
				image: (await hmfull.HMtai.sfw.smile()).url,
				type: 'reply',
			},
			ctx,
		);
	},
};
