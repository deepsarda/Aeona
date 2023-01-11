import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import boostLogs from '../../database/models/boostChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'boostlogs',
	description: 'Setup the boostlogs for your server.',
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
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const channel = await ctx.options.getChannel('channel', true);

		client.extras.createChannelSetup(boostLogs, channel, ctx);
	},
} as CommandOptions;
