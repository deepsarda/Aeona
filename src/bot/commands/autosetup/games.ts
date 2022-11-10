import Counting from '../../database/models/countChannel.js';
import GTN from '../../database/models/guessNumber.js';
import GTW from '../../database/models/guessWord.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'games',
	description: 'Generate channels for all my games',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [
		{
			name: 'setup',
			description: 'counting/guess-the-number/guess-the-word',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const choice = ctx.options.getString('setup', true).toLowerCase();

		if (!['counting', 'guess-the-number', 'guess-the-word'].includes(choice))
			return client.extras.errUsage(
				{ usage: 'autosetup games counting/guess-the-number/guess-the-word', type: 'reply' },
				ctx,
			);

		if (choice == 'counting') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Counting',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

			client.extras.embed(
				{
					title: `Counting`,
					desc: `This is the start of counting! The first number is **1**`,
				},
				channel,
			);

			client.extras.createChannelSetup(Counting, channel, ctx);
		}

		if (choice == 'guess-the-number') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Guess-The-Number',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

			client.extras.embed(
				{
					title: `Guess the number`,
					desc: `Guess the number between **1** and **10,000**!`,
				},
				channel,
			);

			client.extras.createChannelSetup(GTN, channel, ctx);
		}

		if (choice == 'guess-the-word') {
			const channel = await client.helpers.createChannel(ctx.guildId!, {
				name: 'Guess-The-Word',
				//@ts-ignore
				type: ChannelTypes.GuildText,
			});

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
							name: `Word`,
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
