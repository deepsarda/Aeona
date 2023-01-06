import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import boostLogs from '../../database/models/boostChannels.js';
import levelLogs from '../../database/models/levelChannels.js';
import logs from '../../database/models/logChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'logs',
	description: 'Setup logging channels',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [
		{
			name: 'setup',
			description: 'serverlogs/levellogs/boostlogs',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const choice = ctx.options.getString('setup', true).toLowerCase();

		if (!['serverlogs', 'levellogs', 'boostlogs'].includes(choice))
			return client.extras.errUsage({ usage: 'autosetup log serverlogs/levellogs/boostlogs', type: 'edit' }, ctx);

		if (choice == 'serverlogs') {
			const channel = await client.helpers.createChannel(ctx.guild!.id!, {
				name: 'Logs',

				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(logs, channel, ctx);
		}

		if (choice == 'levellogs') {
			const channel = await client.helpers.createChannel(ctx.guild!.id!, {
				name: 'levelLogs',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(levelLogs, channel, ctx);
		}

		if (choice == 'boostlogs') {
			const channel = await client.helpers.createChannel(ctx.guild!.id!, {
				name: 'boostLogs',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(boostLogs, channel, ctx);
		}
	},
} as CommandOptions;
