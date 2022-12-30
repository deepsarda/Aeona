import leaveChannel from '../../database/models/leaveChannels.js';
import { ChannelTypes } from 'discordeno/types';
import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'leavechannel',
	description: 'Setup the leave channel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const channel = await client.helpers.createChannel(ctx.guild!.id!, {
			name: 'Bye',
			//@ts-ignore
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(leaveChannel, channel, ctx);
	},
} as CommandOptions;
