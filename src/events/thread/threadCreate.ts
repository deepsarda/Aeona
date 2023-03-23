import { Channel } from 'discordeno';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, channel: Channel) => {
  const logsChannel = await client.extras.getLogs(channel.guildId);
  if (!logsChannel) return;

  client.extras
    .embed(
      {
        title: `📖 Thread created`,
        desc: `A thread has been created`,
        fields: [
          {
            name: `<:name:1062774821190111272>  Name`,
            value: `${channel.name}`,
          },
          {
            name: `<:id:1062774182892552212> ID`,
            value: `${channel.id}`,
          },
          {
            name: `<:channel:1049292166343688192> Channel`,
            value: `<#${channel.id}>`,
          },
          {
            name: `💬 Type`,
            value: `${channel.type}`,
          },
        ],
      },
      logsChannel,
    )
    .catch();
};
