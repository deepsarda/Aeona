import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/warnings.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'warn',
  description: 'Warn a user.',
  commandType: ['application', 'message'],
  category: 'moderation',
  args: [
    {
      name: 'user',
      description: 'The user to warn.',
      required: true,
      type: 'User',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const member = await ctx.options.getUser('user', true);

    Schema.findOne(
      { Guild: ctx.guild!.id, User: member.id },
      async (err: any, data: { Warns: number; save: () => void }) => {
        if (data) {
          data.Warns += 1;
          data.save();
        } else {
          new Schema({
            Guild: ctx.guild!.id,
            User: `${member.id}`,
            Warns: 1,
          }).save();
        }
      },
    );
    const channel = await client.helpers.getDmChannel(member.id);
    client.extras
      .embed(
        {
          title: `🔨 Warn`,
          desc: `You've been warned in **${ctx.guild.name}**`,
          fields: [
            {
              name: '<:members:1063116392762712116> Moderator',
              value: `${ctx.user.username}#${ctx.user.discriminator}`,
              inline: true,
            },
          ],
        },
        channel,
      )
      .catch();

    client.emit('warnAdd', member, ctx.user);
    client.extras.succNormal(
      {
        text: `User has received a warning!`,
        fields: [
          {
            name: '<:members:1063116392762712116> User',
            value: `<@${member.id}>`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
