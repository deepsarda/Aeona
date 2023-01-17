import { Channel } from 'discordeno/transformers';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, channel: Channel) => {
  try {
    const data = await Schema.findOne({ Guild: channel.guildId });
    if (!data || !data.Channels) return;

    let channelName = await client.extras.getTemplate(channel.guildId);
    const channels = await client.helpers.getChannels(channel.guildId);
    channelName = channelName.replace(`{emoji}`, '🔧');
    channelName = channelName.replace(`{name}`, `Channels: ${channels.size}`);

    client.helpers.editChannel(data.Channels, {
      name: channelName,
    });
  } catch {
    //Fix lint error
  }
};
