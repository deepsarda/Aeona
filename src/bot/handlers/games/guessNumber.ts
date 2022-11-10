import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import Schema from '../../database/models/guessNumber.js';

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if (message.member?.user?.toggles.bot) return;
		if (!message.guildId) return;
		const data = await Schema.findOne({
			Guild: message.guildId,
			Channel: message.channelId,
		});
		if (data) {
			const number = parseInt(data.Number);
			const userNumber = parseInt(message.content);
			if (!userNumber || isNaN(userNumber)) return;

			if (userNumber == number) {
				bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.check);
				const number = Math.ceil(Math.random() * 10000);

				client.extras.sendEmbedMessage(
					{
						title: `Guess the number`,
						desc: `The number is guessed!!`,
						fields: [
							{
								name: `→ Guessed by`,
								value: `<@${message.member?.user.id}> (${
									message.member?.user.username + '#' + message.member?.user?.discriminator
								})`,
								inline: true,
							},
							{
								name: `→ Correct number`,
								value: `${data.Number}`,
								inline: true,
							},
						],
					},
					message,
				);

				data.Number = number + '';
				data.save();

				client.extras.sendEmbedMessage(
					{
						title: `🔢 Guess the number`,
						desc: `Guess the number between **1** and **10.000**!`,
					},
					message,
				);
			} else if (userNumber > number) {
				return client.helpers.sendMessage(message.channelId, {
					content: 'Oh no! You guessed too high!',
				});
			} else if (userNumber < number) {
				return client.helpers.sendMessage(message.channelId, {
					content: 'Oh no! You guessed too low!',
				});
			}
		}
	});
};
