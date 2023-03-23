import { Guild } from 'discordeno/transformers';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
  try {
    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Roles) return;

    let channelName = await client.extras.getTemplate(guild.id);
    const roles = await client.helpers.getRoles(guild.id);
    channelName = channelName.replace(`{emoji}`, '👔');
    channelName = channelName.replace(`{name}`, `Roles: ${roles.size}`);

    client.helpers.editChannel(data.Roles, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
