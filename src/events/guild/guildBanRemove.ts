import { User } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, ban: User, guildId: bigint) => {
  const logsChannel = await client.extras.getLogs(guildId);
  if (!logsChannel) return;

  client.extras
    .embed(
      {
        title: `🔧 Member unbanned`,
        desc: `A user has been unbanned`,
        thumbnail: client.helpers.getAvatarURL(`${ban.id}`, ban.discriminator, {
          avatar: ban.avatar,
        }),
        fields: [
          {
            name: `<:members:1063116392762712116> User`,
            value: `<@${ban.id}>`,
          },
          {
            name: `<:name:1062774821190111272> Tag`,
            value: `${`${ban.username}${ban.discriminator}`}`,
          },
          {
            name: `<:id:1062774182892552212> ID`,
            value: `${ban.id}`,
          },
        ],
      },
      logsChannel,
    )
    .catch();
};
