import { Guild } from 'discordeno/transformers';
import { PremiumTiers } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

/* A type definition for the client. */

export default async (client: AeonaBot, guild: Guild) => {
  try {
    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.BoostTier) return;

    let channelName = await client.extras.getTemplate(guild.id);
    channelName = channelName.replace(`{emoji}`, '🥇');
    channelName = channelName.replace(`{name}`, `Tier: ${PremiumTiers[guild.premiumTier] || '0'}`);

    client.helpers.editChannel(data.BoostTier, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
