import Suggestion from '../../database/models/suggestionChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';
export default {
	name: 'suggestions',
	description: 'Setup the suggestions channel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const channel = await client.helpers.createChannel(ctx.guildId!, {
			name: 'Suggestions',
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(Suggestion, channel, ctx);
	},
};
