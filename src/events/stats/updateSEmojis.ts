import { Emoji, Guild } from '@discordeno/bot';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, emoji: Emoji, guild: Guild) => {
  if (!emoji.toggles.animated) {
    try {
      const data = await Schema.findOne({ Guild: guild.id });
      if (!data || !data.StaticEmojis) return;

      let Animated = 0;
      const emojies = await client.helpers.getEmojis(guild.id);
      emojies.forEach((emoji) => {
        if (!emoji.toggles.animated) {
          Animated++;
        }
      });

      let channelName = await client.extras.getTemplate(guild.id);
      channelName = channelName.replace(`{emoji}`, '🤡');
      channelName = channelName.replace(`{name}`, `Static Emojis: ${Animated || '0'}`);

      client.helpers.editChannel(data.StaticEmojis, {
        name: channelName,
      });
    } catch {
      //Fix lint error
    }
  }
};
