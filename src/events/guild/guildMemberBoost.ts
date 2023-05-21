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
        content:
          '<:AH_LoveCat:1050681792060985414> Thank you {user:mention}, for <:F_Boost:1049289262429900830> boosting us.',
      };

      if (schema.boostMessage) {
        try {
          message = JSON.parse(schema.boostMessage);
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
