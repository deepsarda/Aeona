import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';

import Chatbot from '../../database/models/chatbot-channel.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'chatbot',
	description: 'Setup the chatbot',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const channel = await client.helpers.createChannel(ctx.guild!.id!, {
			name: 'Chatbot',
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(Chatbot, channel, ctx);
	},
} as CommandOptions;
