import { Point } from '@influxdata/influxdb-client';
import { AmethystBot, AmethystEmbed } from '@thereallonewolf/amethystframework';
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
				'\n Generate beautiful images using /imagine \n || https://media.discordapp.net/attachments/1034419695060791342/1044217539682652170/unknown.png ||',
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

			const embed = new AmethystEmbed()
				.setTitle(`Chatbot`)
				.addField(
					'User:',
					'<@' +
						message.member.id +
						'> \n' +
						message.member.user.username +
						'#' +
						message.member.user.discriminator +
						`(${message.member.id})`,
				)
				.addField('Content: ', message.content)
				.addField('Reply', json)
				.addField('Channel:', (await bot.cache.channels.get(message.channelId)).name)
				.addField('Guild:', (await bot.cache.guilds.get(message.guildId)).name);
			bot.extras.webhook({
				username: 'Logs',
				embeds: [embed],
			});

			Influx?.writePoint(new Point('commandruncount').tag('action', 'addition').intField('usage', 1));
		})

		.catch((err) => console.error('error:' + err));
};
