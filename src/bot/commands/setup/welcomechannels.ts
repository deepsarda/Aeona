import welcomeChannel from '../../database/models/welcomeChannels.js';
import leaveChannel from '../../database/models/leaveChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'welcomechannels',
	description: 'Set up welcome and leave channels',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'setup',
			description: 'welcomechannel/leavechannel',
			type: 'String',
			required: true,
		},
		{
			name: 'channel',
			description: 'The channel to setup',
			required: true,
			type: 'Channel',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const choice = ctx.options.getString('setup', true);
		const channel = await ctx.options.getChannel('channel', true);

		if (choice == 'welcomechannel') {
			client.extras.createChannelSetup(welcomeChannel, channel, ctx);
		}

		if (choice == 'leavechannel') {
			client.extras.createChannelSetup(leaveChannel, channel, ctx);
		}
	},
};
