import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'support',
	description: 'Join the support server',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const row = new Components().addButton('join', 'Link', client.extras.config.discord.serverInvite);
		client.extras.embed(
			{
				title: `Support`,
				desc: `Join the support server.`,
				url: client.extras.config.discord.serverInvite,
				components: row,
				type: 'reply',
			},
			ctx,
		);
	},
};
