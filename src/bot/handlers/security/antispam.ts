import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import Schema from '../../database/models/functions.js';

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 3000;

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if(!message.content || message.content.length <1)return;
		if (!message.member) return;
		if (!message.member.user) return;
		if (message.member.user.toggles.bot) return;

		Schema.findOne({ Guild: message.guildId }, async (err: any, data: { AntiSpam: boolean }) => {
			if (data) {
				if (data.AntiSpam == true) {
					if (usersMap.has(message.authorId)) {
						const userData = usersMap.get(message.authorId);
						const { lastMessage, timer } = userData;
						const difference = message.timestamp - lastMessage.timestamp;
						let msgCount = userData.msgCount;

						if (difference > DIFF) {
							clearTimeout(timer);
							userData.msgCount = 1;
							userData.lastMessage = message;
							userData.timer = setTimeout(() => {
								usersMap.delete(message.authorId);
							}, TIME);
							usersMap.set(message.authorId, userData);
						} else {
							++msgCount;
							if (parseInt(msgCount) === LIMIT) {
								client.helpers.deleteMessage(message.channelId, message.id);
								client.extras.sendEmbedMessage(
									{
										title: `${client.extras.emotes.normal.error} Moderator`,
										desc: `It is not allowed to spam in this server!`,
										color: client.extras.config.colors.error,
										content: `<@${message.authorId}>`,
									},
									message,
								);
							} else {
								userData.msgCount = msgCount;
								usersMap.set(message.authorId, userData);
							}
						}
					} else {
						const fn = setTimeout(() => {
							usersMap.delete(message.authorId);
						}, TIME);
						usersMap.set(message.authorId, {
							msgCount: 1,
							lastMessage: message,
							timer: fn,
						});
					}
				}
			}
		});
	});
};
