import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, user, mod) => {
  const logsChannel = await client.extras.getLogs(user.guild.id);
  if (!logsChannel) return;

  client.extras
    .embed(
      {
        title: `🔨 Member unwarned`,
        desc: `A user has been unwarned`,
        fields: [
          {
            name: `<:members:1063116392762712116> User`,
            value: `<@${user.id}>`,
          },
          {
            name: `<:name:1062774821190111272> Tag`,
            value: `${user.user.username}#${user.user.discriminator}`,
          },
          {
            name: `<:id:1062774182892552212> ID`,
            value: `${user.id}`,
          },
          {
            name: `<:members:1063116392762712116> Moderator`,
            value: `<@${mod.id}> (${mod.id})`,
          },
        ],
      },
      logsChannel,
    )
    .catch();
};
