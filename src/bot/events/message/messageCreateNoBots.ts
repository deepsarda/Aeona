import { Point } from '@influxdata/influxdb-client';
import { AmethystBot } from '@thereallonewolf/amethystframework';
import { BigString, Message } from 'discordeno';
import fetch from 'node-fetch';
import afk from '../../database/models/afk.js';
import chatBotSchema from '../../database/models/chatbot-channel.js';
import Functions from '../../database/models/functions.js';
import levelLogs from '../../database/models/levelChannels.js';
import messageSchema from '../../database/models/levelMessages.js';
import levelRewards from '../../database/models/levelRewards.js';
import messageRewards from '../../database/models/messageRewards.js';
import messagesSchema from '../../database/models/messages.js';
import Schema from '../../database/models/stickymessages.js';
import { Influx } from '../client/commandStart.js';
import Schema1 from '../../database/models/votecredits.js';
export default async (client: AmethystBot, message: Message) => {
	client.extras.messageCount++;

	// Levels
	Functions.findOne({ Guild: message.guildId }, async (err: any, data: { Levels: boolean }) => {
		if (data) {
			if (data.Levels == true) {
				const randomXP = Math.floor(Math.random() * 9) + 1;
				const hasLeveledUp = await client.extras.addXP(message.authorId, message.guildId, randomXP);

				if (hasLeveledUp) {
					const user = await client.extras.fetchLevels(message.authorId, message.guildId);

					const levelData = await levelLogs.findOne({
						Guild: message.guildId,
					});
					const messageData = await messageSchema.findOne({
						Guild: message.guildId,
					});

					if (messageData) {
						let levelMessage = messageData.Message;
						levelMessage = levelMessage.replace(`{user:username}`, message.member?.user?.username);
						levelMessage = levelMessage.replace(`{user:discriminator}`, message.member?.user?.discriminator);
						levelMessage = levelMessage.replace(
							`{user:tag}`,
							message.member?.user?.username + '#' + message.member?.user?.discriminator,
						);
						levelMessage = levelMessage.replace(`{user:mention}`, '<@' + message.member?.user?.id + '>');

						levelMessage = levelMessage.replace(`{user:level}`, user.level);
						levelMessage = levelMessage.replace(`{user:xp}`, user.xp);

						try {
							if (levelData) {
								await client.helpers.sendMessage(levelData.Channel, {
									content: levelMessage,
								});
							} else {
								await client.helpers.sendMessage(message.channelId, {
									content: levelMessage,
								});
							}
						} catch {
							await client.helpers.sendMessage(message.channelId, {
								content: levelMessage,
							});
						}
					} else {
						try {
							if (levelData) {
								client.helpers.sendMessage(levelData.Channel, {
									content: `**GG** <@!${message.authorId}>, you are now level **${user.level}**`,
								});
							} else {
								client.helpers.sendMessage(message.channelId, {
									content: `**GG** <@!${message.authorId}>, you are now level **${user.level}**`,
								});
							}
						} catch {
							client.helpers.sendMessage(message.channelId, {
								content: `**GG** <@!${message.authorId}>, you are now level **${user.level}**`,
							});
						}
					}

					levelRewards.findOne(
						{ Guild: message.guildId, Level: user.level },
						async (err: any, data: { Role: BigString }) => {
							if (data) {
								await client.helpers.addRole(message.guildId!, message.authorId, data.Role);
							}
						},
					);
				}
			}
		}
	});

	// Message tracker system
	messagesSchema.findOne(
		{ Guild: message.guildId, User: message.authorId },
		async (err: any, data: { Messages: number; save: () => void }) => {
			if (data) {
				data.Messages += 1;
				data.save();

				messageRewards.findOne(
					{ Guild: message.guildId, Messages: data.Messages },
					async (err: any, data: { Role: BigString }) => {
						if (data) {
							try {
								await client.helpers.addRole(message.guildId!, message.authorId, data.Role);
							} catch {
								//prevent lint error
							}
						}
					},
				);
			} else {
				new messagesSchema({
					Guild: message.guildId,
					User: message.authorId,
					Messages: 1,
				}).save();
			}
		},
	);

	// AFK system
	afk.findOne({ Guild: message.guildId, User: message.authorId }, async (err: any, data: any) => {
		if (data) {
			await afk.deleteOne({
				Guild: message.guildId,
				User: message.authorId,
			});

			client.extras.simpleMessageEmbed(
				{
					desc: `<@${message.authorId}> is no longer afk!`,
				},
				message,
			);

			if (message.member?.nick?.startsWith(`[AFK] `)) {
				const name = message.member?.nick?.replace(`[AFK] `, ``);
				client.helpers.editMember(message.guildId!, message.authorId, {
					nick: name,
				});
			}
		}
	});

	message.mentionedUserIds.forEach(async (u) => {
		if (!message.content.includes('@here') && !message.content.includes('@everyone')) {
			afk.findOne({ Guild: message.guildId, User: u }, async (err: any, data: { Message: any }) => {
				if (data) {
					client.extras.simpleMessageEmbed({ desc: `<@${u}> is currently afk! **Reason:** ${data.Message}` }, message);
				}
			});
		}
	});

	// Chat bot
	chatBotSchema.findOne({ Guild: message.guildId }, async (err, data) => {
		if (!data) return;

		if (message.channelId != data.Channel) return;

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
					'\n Generate beautiful images using /imagine \n || https://media.discordapp.net/attachments/1034419695060791342/1044217539682652170/unknown.png ||',
				];
				const randomNumber = Math.floor(Math.random() * 30);
				json = randomNumber == 0 ? (json ?? '') + s[0] : randomNumber == 1 ? (json ?? '') + s[1] : json;
				await client.helpers.sendMessage(message.channelId, {
					content: json,
					messageReference: {
						channelId: message.channelId,
						messageId: message.id + '',
						guildId: message.guildId,
						failIfNotExists: false,
					},
				});
				const user = await Schema1.findOne({ User: message.member.id });
				if (user.LastVersion != client.extras.version)
					client.helpers.sendMessage(message.channelId, {
						content: 'You have unread news. Use `+news` to read it',
					});
				Influx?.writePoint(new Point('commandruncount').tag('action', 'addition').intField('usage', 1));
			})
			.catch((err) => console.error('error:' + err));
	});

	// Sticky messages
	try {
		Schema.findOne(
			{ Guild: message.guildId, Channel: message.channelId },
			async (err: any, data: { LastMessage: any; Content: any; save: () => void }) => {
				if (!data) return;

				const lastStickyMessage = await client.helpers.getMessage(message.channelId, data.LastMessage);
				if (!lastStickyMessage) return;
				await client.helpers.deleteMessage(message.channelId, data.LastMessage);

				const newMessage = await client.extras.simpleMessageEmbed({ desc: `${data.Content}` }, message);

				data.LastMessage = newMessage.id;
				data.save();
			},
		);
	} catch {
		//prevent lint error
	}
};
