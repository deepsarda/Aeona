import { Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno/transformers';
import { Influx } from './commandStart';

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
			Influx?.writePoint(new Point('commands').tag('action', 'addition').tag('command', "chatbot").intField('value', 1));
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
