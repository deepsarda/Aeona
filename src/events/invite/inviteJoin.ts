import { Member, User } from '@discordeno/bot';

import inviteBy from '../../database/models/inviteBy.js';
import rewards from '../../database/models/inviteRewards.js';
import invites from '../../database/models/invites.js';
import welcome from '../../database/models/welcome.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, member: Member, invite: User | null, inviter: User | null) => {
  if (invite && inviter) {
    let data = await invites.findOne({
      Guild: member.guildId,
      User: `${inviter.id}`,
    });

    if (data) {
      if (!data.Invites) data.Invites = 0;
      if (!data.Total) data.Total = 0;
      data.Invites += 1;
      data.Total += 1;
      data.save();
    } else {
      data = await new invites({
        Guild: member.guildId,
        User: `${inviter.id}`,
        Invites: 1,
        Total: 1,
        Left: 0,
      });
      data.save();
    }

    inviteBy.findOne(
      { Guild: member.guildId },
      async (err: any, data2: { inviteUser: bigint; User: bigint; save: () => void }) => {
        if (data2) {
          (data2.inviteUser = inviter.id), (data2.User = member.id);
          data2.save();
        } else {
          new inviteBy({
            Guild: member.guildId,
            inviteUser: `${inviter.id}`,
            User: `${member.id}`,
          }).save();
        }
      },
    );

    rewards.findOne({ Guild: member.guildId, Invites: data.Invites }, async (err: any, data: { Role: any }) => {
      if (data) {
        client.helpers.addRole(member.guildId, `${inviter.id}`, data.Role);
      }
    });
  }

  const welcomeSchema = await welcome.find({
    Guild: `${member.guildId}`,
  });

  if (welcomeSchema.length == 0) return;
  const config = await client.extras.getEmbedConfig({
    guild: (await client.cache.guilds.get(member.guildId))!,
    user: (await client.cache.users.get(member.id))!,
  });

  for (let i = 0; i < welcomeSchema.length; i++) {
    const schema = welcomeSchema[i];

    let message = {
      content: 'Welcome {user:mention} to {guild:name}. \n We now have {guild:members} members.',
    };

    if (schema.Message) {
      try {
        message = JSON.parse(schema.Message);
      } catch (e) {
        //
      }
    }
    if (schema.Channel)
      client.helpers.sendMessage(schema.Channel, client.extras.generateEmbedFromData(config, message)).catch();

    if (schema.Role) client.helpers.addRole(member.guildId, `${member.id}`, schema.Role!).catch();
  }
};
