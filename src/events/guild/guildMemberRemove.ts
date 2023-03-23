import { User } from 'discordeno/transformers';

import invitedBy from '../../database/models/inviteBy.js';
import invites from '../../database/models/invites.js';
import leave from '../../database/models/leave.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, user: User, guildId: bigint) => {
  const inviteByData = await invitedBy.findOne({
    Guild: `${guildId}`,
    User: `${user.id}`,
  });

  if (inviteByData) {
    const inviteData = await invites.findOne({
      Guild: `${guildId}`,
      User: inviteByData.inviteUser,
    });

    if (inviteData && inviteData.Invites && inviteData.Left) {
      inviteData.Invites -= 1;
      inviteData.Left += 1;
      inviteData.save();
    }
  }

  const leaveSchema = await leave.find({
    Guild: `${guildId}`,
  });
  if (leaveSchema.length == 0) return;
  const config = await client.extras.getEmbedConfig({
    guild: (await client.cache.guilds.get(guildId))!,
    user: (await client.cache.users.get(user.id))!,
  });

  for (let i = 0; i < leaveSchema.length; i++) {
    const schema = leaveSchema[i];

    let message = {
      content:
        '{user:mention} has left {guild:name}. \n We now have {guild:members} users.',
    };

    if (schema.Message) {
      try {
        message = JSON.parse(schema.Message);
      } catch (e) {
        //
      }
    }
    if (schema.Channel)
      client.helpers
        .sendMessage(
          schema.Channel,
          client.extras.generateEmbedFromData(config, message),
        )
        .catch((e) => console.error(JSON.stringify(e)));
  }
};
