import { Emoji, User } from 'discordeno/transformers';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
  client: AeonaBot,
  reaction: {
    userId: bigint;
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint;
    user?: User;
    emoji: Emoji;
  },
) => {
  if (reaction.emoji.name === '⭐') {
    const schemas = await StarBoard.find({ Guild: reaction.guildId });
    for (let i = 0; i < schemas.length; i++) {
      const data = schemas[i];

      const starboardChannel = await client.cache.channels.get(
        BigInt(data.Channel!),
      );
      if (!starboardChannel) return;

      const fetch = await client.helpers.getMessages(`${starboardChannel.id}`, {
        limit: 100,
      });
      const stars = fetch.find((m) => {
        return m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text.endsWith(`${reaction.messageId}`)
          ? true
          : false;
      });

      if (stars) {
        const foundStar = stars.embeds[0];
        const message = await client.helpers.getMessage(
          reaction.channelId,
          reaction.messageId,
        );

        const starMsg = await client.helpers.getMessage(
          `${starboardChannel.id}`,
          stars.id,
        );
        const image = stars.embeds[0].image?.url;
        if (
          !message.reactions?.find((r) => r.emoji.name == '⭐')?.count ||
          message.reactions?.find((r) => r.emoji.name == '⭐')?.count == 0
        ) {
          client.helpers.deleteMessage(`${starboardChannel.id}`, starMsg.id);
        } else {
          const user = await client.helpers.getUser(message.authorId);
          client.extras.editEmbed(
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
                      ?.count || 1
                  }`,
                  inline: true,
                },
                {
                  name: `💬 Message`,
                  value: `[Jump to the message](https://discord.com/channels/${reaction.guildId}/${reaction.channelId}/${reaction.messageId})`,
                  inline: true,
                },
                {
                  name: `<:members:1063116392762712116> Author`,
                  value: `<@${message.authorId}>`,
                  inline: true,
                },
              ],
              footer: stars.embeds[0].footer?.text,
            },
            starMsg,
          );
        }
      }
    }
  }
};
