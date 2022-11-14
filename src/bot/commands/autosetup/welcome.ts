import welcomeRole from '../../database/models/joinRole.js';
import leaveChannel from '../../database/models/leaveChannels.js';
import welcomeChannel from '../../database/models/welcomeChannels.js';
import { ChannelTypes } from 'discordeno/types';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'welcome',
	description: 'Setup welcome',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [
		{
			name: 'setup',
			description: 'welcomechannel/welcomerole/leavechannel',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const choice = ctx.options.getString('setup', true).toLowerCase();

		if (!['welcomechannel', 'welcomerole', 'leavechannel'].includes(choice))
			return client.extras.errUsage(
				{ usage: 'autosetup welcome welcomechannel/welcomerole/leavechannel', type: 'edit' },
				ctx,
			);
		if (choice == 'welcomechannel') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Logs',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(welcomeChannel, channel, ctx);
		}

		if (choice == 'welcomerole') {
			const role = await client.helpers.createRole(ctx.guildId!, {
				name: 'Member',
				//@ts-ignore
				color: client.extras.config.colors.normal,
			});

			client.extras.createRoleSetup(welcomeRole, role, ctx);
		}

		if (choice == 'leavechannel') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Bye',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(leaveChannel, channel, ctx);
		}
	},
};
