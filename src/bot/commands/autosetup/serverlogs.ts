import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import serverLogs from '../../database/models/logChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'serverlogs',
	description: 'Setup logging channel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const channel = await client.helpers.createChannel(ctx.guild!.id!, {
			name: 'Logs',
			//@ts-ignore
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(serverLogs, channel, ctx);
	},
} as CommandOptions;
