import leaveChannel from '../../database/models/leaveChannels.js';
import { ChannelTypes } from 'discordeno/types';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'leavechannel',
	description: 'Setup the leave channel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const choice = ctx.options.getString('setup', true).toLowerCase();

		const channel = await client.helpers.createChannel(ctx.guildId!, {
			name: 'Bye',
			//@ts-ignore
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(leaveChannel, channel, ctx);
	},
};
