import { Emoji, Guild } from '@discordeno/bot';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, emoji: Emoji, guild: Guild) => {
  try {
    const data = await Schema.findOne({ Guild: guild.id });
    if (!data || !data.Emojis) return;

    const emojies = await client.helpers.getEmojis(guild.id);
    let channelName = await client.extras.getTemplate(guild.id);
    channelName = channelName.replace(`{emoji}`, '😛');
    channelName = channelName.replace(`{name}`, `Emojis: ${emojies.length || '0'}`);

    client.helpers.editChannel(data.Emojis, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
