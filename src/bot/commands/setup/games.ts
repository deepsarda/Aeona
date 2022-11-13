import Counting from '../../database/models/countChannel.js';
import GTN from '../../database/models/guessNumber.js';
import GTW from '../../database/models/guessWord.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'games',
	description: 'Setup counting/guess-the-number/guess-the-word. ',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'setup',
			description: 'counting/guess-the-number/guess-the-word',
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
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const choice = ctx.options.getString('setup', true);
		const channel = await ctx.options.getChannel('channel', true);
		if (!['counting', 'guess-the-number', 'guess-the-word'].includes(choice))
			return client.extras.errUsage(
				{ usage: 'setup games counting/guess-the-number/guess-the-word', type: 'reply' },
				ctx,
			);
		if (choice == 'counting') {
			client.extras.embed(
				{
					title: `🔢 Counting`,
					desc: `This is the start of counting! The first number is **1**`,
				},
				channel,
			);

			client.extras.createChannelSetup(Counting, channel, ctx);
		}

		if (choice == 'guess-the-number') {
			client.extras.embed(
				{
					title: `🔢 Guess the number`,
					desc: `Guess the number between **1** and **10.000**!`,
				},
				channel,
			);

			client.extras.createChannelSetup(GTN, channel, ctx);
		}

		if (choice == 'guess-the-word') {
			const word = 'start';
			const shuffled = word
				.split('')
				.sort(function () {
					return 0.5 - Math.random();
				})
				.join('');

			client.extras.embed(
				{
					title: `Guess the word`,
					desc: `Put the letters in the right position!`,
					fields: [
						{
							name: `→ Word`,
							value: `${shuffled.toLowerCase()}`,
						},
					],
				},
				channel,
			);

			client.extras.createChannelSetup(GTW, channel, ctx);
		}
	},
};
