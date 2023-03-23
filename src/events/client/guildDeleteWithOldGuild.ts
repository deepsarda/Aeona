import { AmethystEmbed } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
  client.extras.lastguildcount = client.cache.guilds.memory.size;
  const embed = new AmethystEmbed()
    .setTitle('🔴 Removed from a server!')
    .addField('Total servers:', `${client.cache.guilds.memory.size}`, true)
    .addField('Server name', `${guild.name}`, true)
    .addField('Server ID', `${guild.id}`, true)
    .addField(
      'Server members',
      `${guild.approximateMemberCount ?? guild.memberCount ?? 1}`,
      true,
    )
    .addField('Server owner', `<@!${guild.ownerId}> (${guild.ownerId})`, true);

  client.extras.webhook({
    embeds: [embed],
  });
};
