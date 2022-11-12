import { AmethystBot, AmethystEmbed, hasGuildPermissions } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import Schema2 from '../../database/models/channelList.js';
import Schema from '../../database/models/functions.js';
export default (client: AmethystBot) => {
	client.on('messageCreate', async (client: AmethystBot, message: Message) => {
		if (!message.content || message.content.length < 1) return;
		Schema.findOne({ Guild: message.guildId }, async (err: any, data: { AntiInvite: boolean; AntiLinks: boolean }) => {
			if (data) {
				if (data.AntiInvite == true) {
					const { content } = message;

					const code = content.split('discord.gg/')[1];
					if (code) {
						Schema2.findOne({ Guild: message.guildId }, async (err: any, data2: { Channels: bigint[] }) => {
							if (data2) {
								if (
									data2.Channels.includes(message.channelId) ||
									hasGuildPermissions(
										client,
										(await client.cache.guilds.get(message.guildId!))!,
										(await client.cache.members.get(message.authorId, message.guildId!))!,
										['MANAGE_MESSAGES'],
									)
								) {
									return;
								}

								client.helpers.deleteMessage(message.channelId, message.id);

								client.extras.sendEmbedMessage(
									{
										title: `${client.extras.emotes.normal.error} Moderator`,
										desc: `Discord links are not allowed in this server!`,
										color: client.extras.config.colors.error,
										content: `<@${message.authorId}>`,
									},
									message,
								);
							} else {
								client.helpers.deleteMessage(message.channelId, message.id);

								client.extras.sendEmbedMessage(
									{
										title: `${client.extras.emotes.normal.error} Moderator`,
										desc: `Discord links are not allowed in this server!`,
										color: client.extras.config.colors.error,
										content: `<@${message.authorId}>`,
									},
									message,
								);
							}
						});
					}
				} else if (data.AntiLinks == true) {
					const { content } = message;

					if (content.includes('http://') || content.includes('https://') || content.includes('www.')) {
						Schema2.findOne({ Guild: message.guildId }, async (err: any, data2: { Channels: bigint[] }) => {
							if (data2) {
								if (
									data2.Channels.includes(message.channelId) ||
									hasGuildPermissions(
										client,
										(await client.cache.guilds.get(message.guildId!))!,
										(await client.cache.members.get(message.authorId, message.guildId!))!,
										['MANAGE_MESSAGES'],
									)
								) {
									return;
								}

								client.helpers.deleteMessage(message.channelId, message.id);

								client.extras.sendEmbedMessage(
									{
										title: `${client.extras.emotes.normal.error} Moderator`,
										desc: `Links are not allowed in this server!`,
										color: client.extras.config.colors.error,
										content: `<@${message.authorId}>`,
									},
									message,
								);
							} else {
								client.helpers.deleteMessage(message.channelId, message.id);

								client.extras.sendEmbedMessage(
									{
										title: `${client.extras.emotes.normal.error} Moderator`,
										desc: `Links are not allowed in this server!`,
										color: client.extras.config.colors.error,
										content: `<@${message.authorId}>`,
									},
									message,
								);
							}
						});
					}
				}
			}
		});
	});

	client.on('messageUpdateWithOldMessage', async (bot: AmethystBot, oldMessage: Message, newMessage: Message) => {
		if (!oldMessage.content || !newMessage.content) return;
		if (oldMessage.content === newMessage.content) {
			return;
		}

		Schema.findOne(
			{ Guild: newMessage.guildId },
			async (err: any, data: { AntiInvite: boolean; AntiLinks: boolean }) => {
				if (data) {
					if (data.AntiInvite == true) {
						const { content } = newMessage;

						const code = content.split('discord.gg/')[1];
						if (code) {
							Schema2.findOne({ Guild: newMessage.guildId }, async (err: any, data2: { Channels: string | any[] }) => {
								if (data2) {
									if (
										data2.Channels.includes(newMessage.channelId + '') ||
										hasGuildPermissions(
											client,
											(await client.cache.guilds.get(newMessage.guildId!))!,
											(await client.cache.members.get(newMessage.authorId, newMessage.guildId!))!,
											['MANAGE_MESSAGES'],
										)
									) {
										return;
									}

									client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
									const error = new AmethystEmbed()
										.setTitle(`${client.extras.emotes.normal.error} Moderator`)
										.setAuthor(
											client.user.username,
											client.helpers.getAvatarURL(client.user.id + '', client.user.discriminator, {
												avatar: client.user.avatar,
											}),
										)
										.setDescription(`Discord links are not allowed in this server!`)
										.setColor(client.extras.config.colors.error)
										.setFooter(client.extras.config.discord.footer)
										.setTimestamp();
									bot.helpers.sendMessage(oldMessage.channelId, {
										content: `<@${newMessage.authorId}>`,
										embeds: [error],
									});
								} else {
									client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
									const error = new AmethystEmbed()
										.setTitle(`${client.extras.emotes.normal.error} Moderator`)
										.setAuthor(
											client.user.username,
											client.helpers.getAvatarURL(client.user.id + '', client.user.discriminator, {
												avatar: client.user.avatar,
											}),
										)
										.setDescription(`Discord links are not allowed in this server!`)
										.setColor(client.extras.config.colors.error)
										.setFooter(client.extras.config.discord.footer)
										.setTimestamp();
									bot.helpers.sendMessage(oldMessage.channelId, {
										content: `<@${newMessage.authorId}>`,
										embeds: [error],
									});
								}
							});
						}
					} else if (data.AntiLinks == true) {
						const { content } = newMessage;

						if (content.includes('http://') || content.includes('https://') || content.includes('www.')) {
							Schema2.findOne({ Guild: newMessage.guildId }, async (err: any, data2: { Channels: string | any[] }) => {
								if (data2) {
									if (
										data2.Channels.includes(newMessage.channelId + '') ||
										hasGuildPermissions(
											client,
											(await client.cache.guilds.get(newMessage.guildId!))!,
											(await client.cache.members.get(newMessage.authorId, newMessage.guildId!))!,
											['MANAGE_MESSAGES'],
										)
									) {
										return;
									}

									client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
									const error = new AmethystEmbed()
										.setTitle(`${client.extras.emotes.normal.error} Moderator`)
										.setAuthor(
											client.user.username,
											client.helpers.getAvatarURL(client.user.id + '', client.user.discriminator, {
												avatar: client.user.avatar,
											}),
										)
										.setDescription(`Links are not allowed in this server!`)
										.setColor(client.extras.config.colors.error)
										.setFooter(client.extras.config.discord.footer)
										.setTimestamp();
									bot.helpers.sendMessage(oldMessage.channelId, {
										content: `<@${newMessage.authorId}>`,
										embeds: [error],
									});
								} else {
									client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
									const error = new AmethystEmbed()
										.setTitle(`${client.extras.emotes.normal.error} Moderator`)
										.setAuthor(
											client.user.username,
											client.helpers.getAvatarURL(client.user.id + '', client.user.discriminator, {
												avatar: client.user.avatar,
											}),
										)
										.setDescription(`Links are not allowed in this server!`)
										.setColor(client.extras.config.colors.error)
										.setFooter(client.extras.config.discord.footer)
										.setTimestamp();
									bot.helpers.sendMessage(oldMessage.channelId, {
										content: `<@${newMessage.authorId}>`,
										embeds: [error],
									});
								}
							});
						}
					}
				}
			},
		);
	});
};
