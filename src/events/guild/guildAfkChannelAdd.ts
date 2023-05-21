import { Channel, Guild } from '@discordeno/bot';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild, afkChannel: Channel) => {
  const logsChannel = await client.extras.getLogs(guild.id);
  if (!logsChannel) return;

  client.extras
    .embed(
      {
        title: `🛑 New AFK channel`,
        desc: `An AFK channel has been added to the server`,
        fields: [
          {
            name: `<:channel:1049292166343688192> Channel`,
            value: `${afkChannel}`,
          },
          {
            name: `<:name:1062774821190111272>  Name`,
            value: `${afkChannel.name}`,
          },
          {
            name: `<:id:1062774182892552212> ID`,
            value: `${afkChannel.id}`,
          },
        ],
      },
      logsChannel,
    )
    .catch();
};
