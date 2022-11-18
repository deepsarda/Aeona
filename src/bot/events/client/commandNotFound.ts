import { Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno/transformers';
import { Influx } from './commandStart.js';
import fetch from 'node-fetch';
export default async (bot: AmethystBot, message: Message, commandName: string) => {
	const url =
		'https://DumBotApi.aeona.repl.co?text=' +
		encodeURIComponent(message.content) +
		'&userId=' +
		message.authorId +
		'&key=' +
		process.env.apiKey;

	const options = {
		method: 'GET',
	};

	fetch(url, options)
		.then((res) => res.text())
		.then(async (json) => {
			Influx?.writePoint(
				new Point('commands').tag('action', 'addition').tag('command', 'chatbot').intField('value', 1),
			);
			const s = [
				'\n discord.gg/qURxRRHPwa',
				'\n Upvote me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote',
			];
			const randomNumber = Math.floor(Math.random() * 10);
			json = randomNumber == 0 ? (json ?? '') + s[0] : randomNumber == 1 ? (json ?? '') + s[1] : json;
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
