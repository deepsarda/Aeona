import { Guild } from '@discordeno/bot';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
  try {
    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Boost) return;

    let channelName = await client.extras.getTemplate(guild.id);
    channelName = channelName.replace(`{emoji}`, '💎');
    channelName = channelName.replace(`{name}`, `Boosts: ${guild.premiumSubscriptionCount || '0'}`);

    client.helpers.editChannel(data.Boost, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
