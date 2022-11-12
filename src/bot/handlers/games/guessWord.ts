import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import Schema from '../../database/models/guessWord.js';

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if (!message.member.user.toggles.bot) return;
		if (!message.guildId) return;
		let wordList = client.extras.config.wordList;
		wordList = wordList.split('\n');

		const data = await Schema.findOne({
			Guild: message.guildId,
			Channel: message.channelId,
		});

		if (data) {
			if (message.content.toLowerCase() == data.Word.toLowerCase()) {
				bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.check);
				const word = wordList[Math.floor(Math.random() * wordList.length)];
				const shuffled = word
					.split('')
					.sort(function () {
						return 0.5 - Math.random();
					})
					.join('');

				client.extras.sendEmbedMessage(
					{
						title: `→ Guess the word`,
						desc: `The word is guessed.`,
						fields: [
							{
								name: `→ Guessed by`,
								value: `<@${message.member?.user.id}> (${
									message.member?.user.username + '#' + message.member?.user?.discriminator
								})`,
								inline: true,
							},
							{
								name: `→ Correct word`,
								value: `${data.Word}`,
								inline: true,
							},
						],
					},
					message,
				);

				data.Word = word;
				data.save();

				return client.extras.sendEmbedMessage(
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
					message,
				);
			} else {
				return bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
			}
		}
	});
};
