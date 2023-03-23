import { Emoji, Member, User } from 'discordeno';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
  client: AeonaBot,
  payload: {
    userId: bigint;
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint;
    member?: Member;
    user?: User;
    emoji: Emoji;
  },
) => {
  if (!client.extras.botConfig.Disabled.includes('starboard'))
    if (payload.emoji.name === '⭐') {
      const schemas = await StarBoard.find({ Guild: payload.guildId });
      for (let i = 0; i < schemas.length; i++) {
        const data = schemas[i];
        const starboardChannel = await client.cache.channels
          .get(BigInt(data.Channel!))
          .catch();
        if (!starboardChannel) return;

        const fetch = await client.helpers.getMessages(
          `${starboardChannel.id}`,
          {
            limit: 100,
          },
        );
        const stars = fetch.find((m) => {
          return m.embeds[0] &&
            m.embeds[0].footer &&
            m.embeds[0].footer.text.endsWith(`${payload.messageId}`)
            ? true
            : false;
        });

        if (stars) {
          const message = await client.helpers.getMessage(
            payload.channelId,
            payload.messageId,
          );
          const foundStar = stars.embeds[0];
          const user = await client.helpers.getUser(message.authorId);
          const image =
            message.attachments.length > 0
              ? await extension(payload, message.attachments[0]?.url)
              : '';

          client.helpers.deleteMessage(`${starboardChannel.id}`, stars.id);

          client.extras.embed(
            {
              desc: foundStar.description,
              image: image,
              author: {
                name: `${user.username}#${user.discriminator}`,
              },
              thumbnail: client.helpers.getAvatarURL(
                user.id,
                user.discriminator,
                {
                  avatar: user.avatar,
                },
              ),
              fields: [
                {
                  name: `:star: Stars`,
                  value: `${
                    message.reactions?.find((r) => r.emoji.name == '⭐')
                      ?.count ?? 1
                  }`,
                  inline: true,
                },
                {
                  name: `💬 Message`,
                  value: `[Jump to the message](https://discord.com/channels/${payload.guildId}/${payload.channelId}/${payload.messageId})`,
                  inline: true,
                },
                {
                  name: `<:members:1063116392762712116> Author`,
                  value: `<@${message.authorId}>`,
                  inline: true,
                },
              ],
              footer: `${payload.messageId}`,
            },
            starboardChannel,
          );
        }
        if (!stars) {
          const message = await client.helpers.getMessage(
            payload.channelId,
            payload.messageId,
          );
          const image =
            message.attachments.length > 0
              ? await extension(payload, message.attachments[0]?.url)
              : '';
          const user = await client.helpers.getUser(message.authorId);
          client.extras.embed(
            {
              desc: message.content,
              image: image,
              author: {
                name: `${user.username}#${user.discriminator}`,
              },
              thumbnail: client.helpers.getAvatarURL(
                user.id,
                user.discriminator,
                {
                  avatar: user.avatar,
                },
              ),
              fields: [
                {
                  name: `:star: Stars`,
                  value: `${
                    message.reactions?.find((r) => r.emoji.name == '⭐')
                      ?.count ?? 1
                  }`,
                  inline: true,
                },
                {
                  name: `💬 Message`,
                  value: `[Jump to the message](https://discord.com/channels/${payload.guildId}/${payload.channelId}/${payload.messageId})`,
                  inline: true,
                },
                {
                  name: `<:members:1063116392762712116> Author`,
                  value: `<@${message.authorId}>`,
                  inline: true,
                },
              ],
              footer: `${payload.messageId}`,
            },
            starboardChannel,
          );
        }
      }
    }
};

function extension(
  reaction: {
    userId: bigint;
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint;
    member?: Member;
    user?: User;
    emoji: Emoji;
  },
  attachment: string,
) {
  const imageLink = attachment.split('.');
  const typeOfImage = imageLink[imageLink.length - 1];
  const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
  if (!image) return '';
  return attachment;
}
