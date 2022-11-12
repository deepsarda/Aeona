import logs from '../../database/models/logChannels.js';
import boostLogs from '../../database/models/boostChannels.js';
import levelLogs from '../../database/models/levelChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'logs',
	description: 'Set up log channels.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'setup',
			description: 'serverlogs/levellogs/boostlogs',
			required: true,
			type: 'String',
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
		const choice = ctx.options.getString('setup',true);
		const channel = await ctx.options.getChannel('channel',true);
		if (!['serverlogs', 'levellogs', 'boostlogs'].includes(choice))
			return client.extras.errUsage({ usage: 'autosetup log serverlogs/levellogs/boostlogs', type: 'edit' }, ctx);
		if (choice == 'serverLogs') {
			client.extras.createChannelSetup(logs, channel, ctx);
		}

		if (choice == 'levelLogs') {
			client.extras.createChannelSetup(levelLogs, channel, ctx);
		}

		if (choice == 'boostLogs') {
			client.extras.createChannelSetup(boostLogs, channel, ctx);
		}
	},
};
