import Birthdays from '../../database/models/birthdaychannels.js';
import Chatbot from '../../database/models/chatbot-channel.js';
import Review from '../../database/models/reviewChannels.js';
import Suggestion from '../../database/models/suggestionChannels.js';
import StarBoard from '../../database/models/starboardChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'fun',
	description: 'Setup birthdays/chatbot/reviews/suggestions/starboard for your server.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'setup',
			description: `birthdays/chatbot/reviews/suggestions/starboard`,
			required: true,
			type: 'String',
		},
		{
			name: 'channel',
			description: 'The channel to setup',
			required: true,
			type: 'Channel',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		console.log('Hmmm');
		const choice = ctx.options.getString('setup', true);
		if (!['birthdays', 'chatbot', 'reviews', 'suggestions', 'starboard'].includes(choice))
			return client.extras.errUsage(
				{ usage: 'setup fun birthdays/chatbot/reviews/suggestions/starboard', type: 'reply' },
				ctx,
			);
		const channel = await ctx.options.getChannel('channel', true);

		if (choice == 'birthdays') {
			client.extras.createChannelSetup(Birthdays, channel, ctx);
		}

		if (choice == 'chatbot') {
			client.extras.createChannelSetup(Chatbot, channel, ctx);
		}

		if (choice == 'reviews') {
			client.extras.createChannelSetup(Review, channel, ctx);
		}

		if (choice == 'suggestions') {
			client.extras.createChannelSetup(Suggestion, channel, ctx);
		}

		if (choice == 'starboard') {
			client.extras.createChannelSetup(StarBoard, channel, ctx);
		}
	},
};
