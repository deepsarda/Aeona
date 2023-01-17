import { AuditLogEntry } from 'discordeno/transformers';
import { AuditLogEvents } from 'discordeno/types';

import logChannels from '../../database/models/logChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, auditLogEntry: AuditLogEntry, guildId: bigint) => {
  const logChannel = (await logChannels.findOne({ Guild: guildId + '' }))!;

  try {
    if (!logChannel.Guild) return;
    const guild = await client.cache.guilds.get(BigInt(logChannel.Guild));

    if (guild) {
      const channel = await client.extras.getLogs(guild.id);
      if (!channel) return;
      if (!auditLogEntry.userId) return;
      const user = await client.helpers.getUser(auditLogEntry.userId);
      let data = {
        title: '',
        desc: '',
        type: '',
        author: {
          name: `${user.username}#${user.discriminator}`,
          iconURL: client.helpers.getAvatarURL(user.id, user.discriminator, {
            avatar: user.avatar,
          }),
        },
        fields: [
          {
            name: `<:id:1062774182892552212> ID`,
            value: `${auditLogEntry.targetId}`,
          },
          {
            name: `💬 Reason`,
            value: `${auditLogEntry.reason ?? 'No reason given'}`,
          },
          {
            name: `<:members:1063116392762712116> By`,
            value: `${
              user
                ? `${user.username}#${user.discriminator}(${user.id})`
                : 'Unable to find the responsible user.'
            }`,
          },
        ],
      };
      if (auditLogEntry.actionType == AuditLogEvents.ChannelCreate)
        data = {
          ...data,
          title: `🔧 Channel Created`,
          desc: `A channel has been Created.`,
          fields: [
            ...data.fields,
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${auditLogEntry.targetId}>`,
            },
          ],
        };

      if (auditLogEntry.actionType == AuditLogEvents.ChannelDelete)
        data = {
          ...data,
          title: `🔧 Channel Deleted`,
          desc: `A channel has been deleted.`,
          fields: [...data.fields],
        };

      if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteCreate)
        data = {
          ...data,
          title: `🔧 Channel Overide Created`,
          desc: `A channel has had a overide created.`,
          fields: [
            ...data.fields,
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${auditLogEntry.targetId}>`,
            },
            {
              name: `⚙️ Modified Settings`,
              value: `${
                auditLogEntry.options?.type == 1
                  ? `<@${auditLogEntry.options?.id}>`
                  : auditLogEntry.options?.roleName
              }`,
            },
          ],
        };
      if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteDelete)
        data = {
          ...data,
          title: `🔧 Channel Overide Delete`,
          desc: `A channel has had a overide deleted.`,
          fields: [
            ...data.fields,
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${auditLogEntry.targetId}>`,
            },
            {
              name: `⚙️ Modified Settings`,
              value: `${
                auditLogEntry.options?.type == 1
                  ? `<@${auditLogEntry.options.id}>`
                  : auditLogEntry.options?.roleName
              }`,
            },
          ],
        };

      if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteUpdate)
        data = {
          ...data,
          title: `🔧 Channel Overide Update`,
          desc: `A channel has had a overide updated.`,
          fields: [
            ...data.fields,
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${auditLogEntry.targetId}>`,
            },
            {
              name: `⚙️ Modified Settings for`,
              value: `${
                auditLogEntry.options?.type == 1
                  ? `<@${auditLogEntry.options?.id}>`
                  : auditLogEntry.options?.roleName
              }`,
            },
          ],
        };

      if (auditLogEntry.actionType == AuditLogEvents.ChannelUpdate)
        data = {
          ...data,
          title: `🔧 Channel Update`,
          desc: `A channel has been updated`,
          fields: [
            ...data.fields,
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${auditLogEntry.targetId}>`,
            },
            {
              name: `⚙️ Modified Settings`,
              value: `${auditLogEntry.changes
                ?.map(
                  (change) =>
                    `**Changed:** ${change.key}. \n  **Before:** ${change.old}\n **Now:** ${change.new} `,
                )
                .join('\n\n')}`,
            },
          ],
        };

      if (auditLogEntry.actionType == AuditLogEvents.GuildUpdate)
        data = {
          ...data,
          title: `🔧 Guild Updated`,
          desc: `Some settings for this server has been changed.`,
          fields: [
            ...data.fields,
            {
              name: `⚙️ Modified Settings`,
              value: `${auditLogEntry.changes
                ?.map(
                  (change) =>
                    `**Changed:** ${change.key}. \n  **Before:** ${change.old}\n **Now:** ${change.new} `,
                )
                .join('\n\n')}`,
            },
          ],
        };

      if (auditLogEntry.actionType == AuditLogEvents.RoleCreate)
        data = {
          ...data,
          title: `🔧 Role Created`,
          desc: `A role has been created`,
          fields: [
            ...data.fields,
            {
              name: `<:role:1062978537436491776> Role`,
              value: `<@&${auditLogEntry.targetId}>`,
            },
          ],
        };
      if (auditLogEntry.actionType == AuditLogEvents.RoleCreate)
        data = {
          ...data,
          title: `🔧 Role Deleted`,
          desc: `A role has been deleted`,
          fields: [
            ...data.fields,
            {
              name: `<:role:1062978537436491776> Role`,
              value: `<@&${auditLogEntry.targetId}>`,
            },
          ],
        };
      if (auditLogEntry.actionType == AuditLogEvents.RoleUpdate)
        data = {
          ...data,
          title: `🔧 Role Updated`,
          desc: `A role has been updated `,
          fields: [
            ...data.fields,
            {
              name: `<:role:1062978537436491776> Role`,
              value: `<@&${auditLogEntry.targetId}>`,
            },
            {
              name: `⚙️ Modified Settings`,
              value: `${auditLogEntry.changes
                ?.map(
                  (change) =>
                    `**Changed:** ${change.key}. \n  **Before:** ${change.old}\n **Now:** ${change.new} `,
                )
                .join('\n\n')}`,
            },
          ],
        };

      if (data.title != '') client.extras.embed(data, channel).catch();
    }
  } catch (e) {
    // console.log(e);
  }
};
