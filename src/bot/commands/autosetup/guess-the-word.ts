import GTW from '../../database/models/guessWord.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import { ChannelTypes } from 'discordeno';
export default {
	name: 'guess-the-word',
	description: 'Setup the chatbot',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const channel = await client.helpers.createChannel(ctx.guild!.id!, {
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
	},
} as CommandOptions;
