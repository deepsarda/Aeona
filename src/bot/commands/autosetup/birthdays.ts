import Birthdays from '../../database/models/birthdaychannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';
export default {
	name: 'birthdays',
	description: 'Setup the birthdays',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	aliases: ['birthday'],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const channel = await client.helpers.createChannel(ctx.guildId!, {
			name: 'Birthdays',
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(Birthdays, channel, ctx);
	},
};
