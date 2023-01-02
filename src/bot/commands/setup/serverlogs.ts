import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import logs from '../../database/models/logChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'serverlogs',
	description: 'Setup the logging for your server for your server.',
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
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const channel = await ctx.options.getChannel('channel', true);

		client.extras.createChannelSetup(logs, channel, ctx);
	},
} as CommandOptions;
