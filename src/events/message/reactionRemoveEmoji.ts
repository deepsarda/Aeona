import { Emoji } from '@discordeno/bot';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
  client: AeonaBot,
  reaction: {
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint;
    emoji: Emoji;
  },
) => {
  if (!client.extras.botConfig.Disabled.includes('starboard'))
    if (reaction.emoji.name === '⭐') {
      const schemas = await StarBoard.find({ Guild: reaction.guildId });
      for (let i = 0; i < schemas.length; i++) {
        const data = schemas[i];

        const starboardChannel = await client.cache.channels.get(BigInt(data.Channel!));
        if (!starboardChannel) return;

        const fetch = await client.helpers.getMessages(`${starboardChannel.id}`, {
          limit: 100,
        });
        const stars = fetch.find((m) => {
          return m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.endsWith(`${reaction.messageId}`)
            ? true
            : false;
        });

        if (stars) client.helpers.deleteMessage(`${starboardChannel.id}`, stars.id);
      }
    }
};
