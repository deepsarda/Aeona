import Schema from '../../database/models/guessWord.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'skipword',
	description: 'skip the word in guess the word',
	commandType: ['application', 'message'],
	category: 'game',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let wordList = client.extras.config.wordList;

		Schema.findOne(
			{ Guild: ctx.guildId, Channel: ctx.channel.id },
			async (err: any, data: { Word: any; save: () => void }) => {
				if (data) {
					try {
						wordList = wordList.split('\n');
						const word = wordList[Math.floor(Math.random() * wordList.length)];
						const shuffled = word
							.split('')
							.sort(function () {
								return 0.5 - Math.random();
							})
							.join('');

						data.Word = word;
						data.save();

						client.extras.succNormal(
							{
								text: `Word skipped successfully!`,
								type: 'ephemeral',
							},
							ctx,
						);

						return client.extras.embed(
							{
								title: `Guess the word`,
								desc: `Put the letters in the right position! \n\n ${shuffled.toLowerCase()}`,
							},
							ctx.channel,
						);
					} catch {
						//This prevents a lint error from happening
					}
				} else {
					client.extras.errNormal(
						{
							error: 'You are not in the right channel!',
							type: 'reply',
						},
						ctx,
					);
				}
			},
		);
	},
};
