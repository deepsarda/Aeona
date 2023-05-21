import { Channel, Guild } from '@discordeno/bot';
import { ChannelTypes } from '@discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, channel: Channel, guild: Guild) => {
  if (channel.type == ChannelTypes.GuildAnnouncement) {
    try {
      const data = await Schema.findOne({ Guild: guild.id });
      if (!data || !data.NewsChannels) return;

      let channelName = await client.extras.getTemplate(guild.id);
      const channels = await client.helpers.getChannels(guild.id);
      channelName = channelName.replace(`{emoji}`, '📢');
      channelName = channelName.replace(
        `{name}`,
        `News Channels: ${channels.filter((channel) => channel.type === ChannelTypes.GuildAnnouncement).length || 0}`,
      );

      client.helpers.editChannel(data.NewsChannels, {
        name: channelName,
      });
    } catch {
      //Fix lint error
    }
  }
};
