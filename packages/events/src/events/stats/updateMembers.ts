import { Guild } from 'discordeno';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
  try {
    let channelName = await client.extras.getTemplate(guild.id);
    channelName = channelName.replace(`{emoji}`, '👤');
    channelName = channelName.replace(
      `{name}`,
      `Members: ${guild.approximateMemberCount?.toLocaleString()}`,
    );

    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Members) return;
    client.helpers.editChannel(data.Members, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
