import { Member } from '@discordeno/bot';

import Schema from '../../database/models/boostChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, member: Member) => {
  try {
    const data = await Schema.find({ Guild: member.guildId });
    if (data.length == 0) return;
    const config = await client.extras.getEmbedConfig({
      guild: (await client.cache.guilds.get(member.guildId))!,
      user: (await client.cache.users.get(member.id))!,
    });

    for (let i = 0; i < data.length; i++) {
      const schema = data[i];

      let message = {
        content: 'Sadly {user:mention} has stopped boosting us.',
      };

      if (schema.unboostMessage) {
        try {
          message = JSON.parse(schema.unboostMessage);
        } catch (e) {
          //prevent lint errors
        }
      }

      if (schema.Channel)
        client.helpers.sendMessage(schema.Channel, client.extras.generateEmbedFromData(config, message)).catch();
    }
  } catch {
    //prevent lint errors
  }
};
