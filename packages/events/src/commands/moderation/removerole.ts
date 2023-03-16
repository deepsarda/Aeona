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
      description: 'The user to remove the role from.',
      required: true,
      type: 'User',
    },
    {
      name: 'role',
      description: 'The role to remove from the user.',
      required: false,
      type: 'Role',
    },
    {
      name: 'reason',
      description: 'The reason for removing the role.',
      required: false,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_ROLES'],
  async execute(client: AeonaBot, ctx: Context) {
    const user = await ctx.options.getUser('user', true);
    const role = await ctx.options.getRole('role');
    const reason = ctx.options.getLongString('reason') || 'Not given';

    try {
      await client.helpers.removeRole(ctx.guild!.id, user.id, role?.id, reason);
      client.extras.succNormal({
        text: `Successfully removed the role from ${user.username}.`
      }, ctx);
    } catch (err) {
      client.extras.errNormal({
        error: `Failed to remove the role from ${user.username}. Please check that the user has the role and I have permission to remove it.`
      }, ctx);
    }
  },
} as CommandOptions;
