import { Member } from 'discordeno';
import { PremiumTiers } from 'discordeno/types';

import Schema from '../../database/models/boostChannels.js';
import Schema2 from '../../database/models/boostMessage.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, member: Member) => {
  try {
    const channelData = await Schema.findOne({ Guild: member.guildId });
    const messageData = await Schema2.findOne({ Guild: member.guildId });

    if (messageData) {
      const guild = await client.cache.guilds.get(member.guildId);
      if (!guild) return;
      const u = await client.helpers.getUser(member.id);

      let boostMessage = messageData.unboostMessage!;
      boostMessage = boostMessage.replace(`{user:username}`, u.username!);
      boostMessage = boostMessage.replace(`{user:discriminator}`, u.discriminator!);
      boostMessage = boostMessage.replace(`{user:tag}`, u.username! + '#' + u.discriminator!);
      boostMessage = boostMessage.replace(`{user:mention}`, '<@' + member.id + '>');

      boostMessage = boostMessage.replace(`{guild:name}`, guild.name);
      boostMessage = boostMessage.replace(`{guild:members}`, guild.approximateMemberCount! + '');
      boostMessage = boostMessage.replace(`{guild:boosts}`, guild.premiumSubscriptionCount! + '');
      boostMessage = boostMessage.replace(`{guild:booststier}`, PremiumTiers[guild.premiumTier!]);

      if (channelData) {
        try {
          const channel = await client.helpers.getChannel(channelData.Channel!);

          client.extras.embed(
            {
              title: `🚀 New unboost`,
              desc: boostMessage,
            },
            channel,
          );
        } catch {
          //prevent lint errors
        }
      }
    } else {
      if (channelData) {
        try {
          const channel = await client.helpers.getChannel(BigInt(channelData.Channel!));
          if (!channel) return;
          client.extras.embed(
            {
              title: `🚀 New unboost`,
              desc: `<@${member.id}> unboosted the server!`,
            },
            channel,
          );
        } catch {
          //prevent lint errors
        }
      }
    }
  } catch {
    //prevent lint errors
  }
};
