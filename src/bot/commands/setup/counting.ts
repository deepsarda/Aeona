import Counting from '../../database/models/countChannel.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'counting',
	description: 'Setup counting for your server.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'channel',
			description: 'The channel to setup',
			required: true,
			type: 'Channel',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const channel = await ctx.options.getChannel('channel', true);
		client.extras.embed(
			{
				title: `🔢 Counting`,
				desc: `This is the start of counting! The first number is **1**`,
			},
			channel,
		);
		client.extras.createChannelSetup(Counting, channel, ctx);
	},
};
