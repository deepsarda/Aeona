import Birthdays from '../../database/models/birthdaychannels.js';
import Chatbot from '../../database/models/chatbot-channel.js';
import Review from '../../database/models/reviewChannels.js';
import StarBoard from '../../database/models/starboardChannels.js';
import Suggestion from '../../database/models/suggestionChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';
export default {
	name: 'fun',
	description: 'Setup all my fun features',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [
		{
			name: 'setup',
			description: 'birthdays/chatbot/reviews/suggestions/starboard',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const choice = ctx.options.getString('setup', true);
		if (!['birthdays', 'chatbot', 'reviews', 'suggestions', 'starboard'].includes(choice))
			return client.extras.errUsage(
				{ usage: 'autosetup birthdays/chatbot/reviews/suggestions/starboard', type: 'reply' },
				ctx,
			);
		if (choice == 'birthdays') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Birthdays',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(Birthdays, channel, ctx);
		}

		if (choice == 'chatbot') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Chatbot',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(Chatbot, channel, ctx);
		}

		if (choice == 'reviews') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Review',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(Review, channel, ctx);
		}

		if (choice == 'suggestions') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Suggestions',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(Suggestion, channel, ctx);
		}

		if (choice == 'starboard') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'StarBoard',
				type: ChannelTypes.GuildText,
			});

			client.extras.createChannelSetup(StarBoard, channel, ctx);
		}
	},
};
