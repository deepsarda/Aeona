import { AeonaBot } from '../../extras/index.js';
import { Emoji, Guild } from 'discordeno/transformers';
import Schema from '../../database/models/stats.js';

export default async (client: AeonaBot, emoji: Emoji, guild: Guild) => {
  try {
    const emojies = await client.helpers.getEmojis(guild.id);
    let channelName = await client.extras.getTemplate(guild.id);
    channelName = channelName.replace(`{emoji}`, '😛');
    channelName = channelName.replace(`{name}`, `Emojis: ${emojies.size || '0'}`);

    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Emojis) return;
    client.helpers.editChannel(data.Emojis, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
