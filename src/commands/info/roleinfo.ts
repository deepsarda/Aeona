import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'roleinfo',
  description: 'Generate a chat message',
  commandType: ['application', 'message'],
  category: 'info',
  args: [
    {
      name: 'role',
      description: 'Role to get information about',
      required: true,
      type: 'Role',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const role = await ctx.options.getRole('role', true);

    client.extras.embed(
      {
        title: `ℹ️ Role information`,
        thumbnail: client.helpers.getGuildIconURL(`${ctx.guild!.id}`, undefined),
        desc: `Information about the role <@&${role.id}>`,
        fields: [
          {
            name: 'Role ID:',
            value: `${role.id}`,
            inline: true,
          },
          {
            name: 'Role Name:',
            value: `${role.name}`,
            inline: true,
          },
          {
            name: 'Mentionable:',
            value: `${role.toggles.mentionable ? 'Yes' : 'No'}`,
            inline: true,
          },
          {
            name: 'Role Permissions:',
            value: `${role.permissions}`,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
