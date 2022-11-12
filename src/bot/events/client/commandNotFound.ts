import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno/transformers';

export default async (bot: AmethystBot, message: Message, commandName: string) => {
	const url =
		'https://aeona3.p.rapidapi.com/?text=' + encodeURIComponent(message.content) + '&userId=' + message.authorId;

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': process.env.apiKey!,
			'X-RapidAPI-Host': 'aeona3.p.rapidapi.com',
		},
	};

	fetch(url, options)
		.then((res) => res.text())
		.then(async (json) => {
			await bot.helpers.sendMessage(message.channelId, {
				content: json,
				messageReference: {
					channelId: message.channelId,
					messageId: message.id + '',
					guildId: message.guildId,
					failIfNotExists: false,
				},
			});
		})
		.catch((err) => console.error('error:' + err));
};
