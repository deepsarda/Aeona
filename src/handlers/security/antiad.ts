import { AmethystEmbed, calculateBasePermissions } from '@thereallonewolf/amethystframework';
import { Message, avatarUrl } from '@discordeno/bot';
import { Permissions } from '@discordeno/bot';
import Schema2 from '../../database/models/channelList.js';
import Schema from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default (client: AeonaBot) => {
  client.on('messageCreateNoBots', async (client: AeonaBot, message: Message) => {
    if (!message.content || message.content.length < 1) return;
    Schema.findOne({ Guild: message.guildId }, async (err: any, data: { AntiInvite: boolean; AntiLinks: boolean }) => {
      if (data) {
        if (data.AntiInvite == true) {
          const { content } = message;

          const code = content.split('discord.gg/')[1];

          if (code) {
            Schema2.findOne({ Guild: message.guildId }, async (err: any, data2: { Channels: bigint[] }) => {
              if (data2) {
                const member = await client.helpers.getMember(message.guildId, message.author.id);
                member.permissions = new Permissions(
                  calculateBasePermissions(await client.cache.guilds.get(message.guildId), member!),
                );
                if (data2.Channels.includes(message.channelId) || member.permissions.has('MANAGE_MESSAGES')) {
                  return;
                }

                client.helpers.deleteMessage(message.channelId, message.id);

                client.extras.sendEmbedMessage(
                  {
                    title: `${client.extras.emotes.normal.error} Moderator`,
                    desc: `Discord links are not allowed in this server!`,
                    color: client.extras.config.colors.error,
                    content: `<@${message.author.id}>`,
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
                    content: `<@${message.author.id}>`,
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
                const member = await client.helpers.getMember(message.guildId, message.author.id);
                member.permissions = new Permissions(
                  calculateBasePermissions(await client.cache.guilds.get(message.guildId), member),
                );
                if (data2.Channels.includes(message.channelId) || member.permissions.has('MANAGE_MESSAGES')) {
                  return;
                }

                client.helpers.deleteMessage(message.channelId, message.id);

                client.extras.sendEmbedMessage(
                  {
                    title: `${client.extras.emotes.normal.error} Moderator`,
                    desc: `Links are not allowed in this server!`,
                    color: client.extras.config.colors.error,
                    content: `<@${message.author.id}>`,
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
                    content: `<@${message.author.id}>`,
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

  client.on('messageUpdateWithOldMessage', async (bot: AeonaBot, oldMessage: Message, newMessage: Message) => {
    if (!oldMessage || !newMessage) return;
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
                  const member = await client.helpers.getMember(newMessage.guildId, newMessage.author.id);
                  member.permissions = new Permissions(
                    calculateBasePermissions(await client.cache.guilds.get(newMessage.guildId), member),
                  );
                  if (data2.Channels.includes(`${newMessage.channelId}`) || member.permissions.has('MANAGE_MESSAGES')) {
                    return;
                  }

                  client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
                  const error = new AmethystEmbed()
                    .setTitle(`${client.extras.emotes.normal.error} Moderator`)
                    .setAuthor(
                      client.user.username,
                      avatarUrl(`${client.user.id}`, client.user.discriminator, {
                        avatar: client.user.avatar,
                      }),
                    )
                    .setDescription(`Discord links are not allowed in this server!`)
                    .setColor(client.extras.config.colors.error)

                    .setTimestamp();
                  bot.helpers.sendMessage(oldMessage.channelId, {
                    content: `<@${newMessage.author.id}>`,
                    embeds: [error],
                  });
                } else {
                  client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
                  const error = new AmethystEmbed()
                    .setTitle(`${client.extras.emotes.normal.error} Moderator`)
                    .setAuthor(
                      client.user.username,
                      avatarUrl(`${client.user.id}`, client.user.discriminator, {
                        avatar: client.user.avatar,
                      }),
                    )
                    .setDescription(`Discord links are not allowed in this server!`)
                    .setColor(client.extras.config.colors.error)

                    .setTimestamp();
                  bot.helpers.sendMessage(oldMessage.channelId, {
                    content: `<@${newMessage.author.id}>`,
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
                  const member = await client.helpers.getMember(newMessage.guildId, newMessage.author.id);
                  member.permissions = new Permissions(
                    calculateBasePermissions(await client.cache.guilds.get(newMessage.guildId), member),
                  );
                  if (data2.Channels.includes(`${newMessage.channelId}`) || member.permissions.has('MANAGE_MESSAGES')) {
                    return;
                  }

                  client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
                  const error = new AmethystEmbed()
                    .setTitle(`${client.extras.emotes.normal.error} Moderator`)
                    .setAuthor(
                      client.user.username,
                      avatarUrl(`${client.user.id}`, client.user.discriminator, {
                        avatar: client.user.avatar,
                      }),
                    )
                    .setDescription(`Links are not allowed in this server!`)
                    .setColor(client.extras.config.colors.error)
                    .setTimestamp();
                  bot.helpers.sendMessage(oldMessage.channelId, {
                    content: `<@${newMessage.author.id}>`,
                    embeds: [error],
                  });
                } else {
                  client.helpers.deleteMessage(oldMessage.channelId, oldMessage.id);
                  const error = new AmethystEmbed()
                    .setTitle(`${client.extras.emotes.normal.error} Moderator`)
                    .setAuthor(
                      client.user.username,
                      avatarUrl(`${client.user.id}`, client.user.discriminator, {
                        avatar: client.user.avatar,
                      }),
                    )
                    .setDescription(`Links are not allowed in this server!`)
                    .setColor(client.extras.config.colors.error)

                    .setTimestamp();
                  bot.helpers.sendMessage(oldMessage.channelId, {
                    content: `<@${newMessage.author.id}>`,
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
