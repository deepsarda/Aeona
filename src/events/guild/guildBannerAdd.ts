import { AeonaBot } from '../../extras/index.js';
import { Guild } from '@discordeno/bot';

export default async (client: AeonaBot, guild: Guild, bannerURL: string) => {
  const logsChannel = await client.extras.getLogs(guild.id);
  if (!logsChannel) return;

  client.extras
    .embed(
      {
        title: `🖼️ New banner`,
        desc: `The server banner has been updated`,
        image: bannerURL,
      },
      logsChannel,
    )
    .catch();
};
