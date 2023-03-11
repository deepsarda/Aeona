import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'removerole',
  description: 'Remove a role from a user.',
  commandType: ['application', 'message'],
  category: 'moderation',
  args: [
    {
      name: 'user',
      description: 'The user to remove a role from.',
      required: true,
      type: 'User',
    },
    {
      name: 'role',
      description: 'The role to be removed from the user',
      required: false,
      type: 'Role',
    },
    {
      name: 'reason',
      description: 'The reason to give the role.',
      required: false,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_ROLES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const user = await ctx.options.getUser('user', true);

    const role = await ctx.options.getRole('role', true);
    const reason = ctx.options.getLongString('reason') || `Not given`;

    client.helpers
      .addRole(ctx.guild.id, user.id, role.id, reason)
      .then(() =>
        client.extras.succNormal(
          {
            text: `I have successfully removed the role from that user.`,
          },
          ctx,
        ),
      )
      .catch(() =>
        client.extras.errNormal(
          {
            error: `I was unable to remove the role from that user. Please check that the user does  have that role and I have premissions to remove it from them.`,
          },
          ctx,
        ),
      );
  },
} as CommandOptions;
