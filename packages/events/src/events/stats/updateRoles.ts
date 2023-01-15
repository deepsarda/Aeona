import { AeonaBot } from '../../extras/index.js';
import { Guild } from 'discordeno/transformers';
import Schema from '../../database/models/stats.js';

export default async (client: AeonaBot, guild: Guild) => {
  try {
    let channelName = await client.extras.getTemplate(guild.id);
    const roles = await client.helpers.getRoles(guild.id);
    channelName = channelName.replace(`{emoji}`, '👔');
    channelName = channelName.replace(`{name}`, `Roles: ${roles.size}`);

    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Roles) return;
    client.helpers.editChannel(data.Roles, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
