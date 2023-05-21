import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'removerolefromhumans',
  description: 'Remove a role from all the humans in your server.',
  commandType: ['application', 'message'],
  category: 'moderation',
  args: [
    {
      name: 'role',
      description: 'The role to be removed',
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

    const role = await ctx.options.getRole('role', true);
    const reason = ctx.options.getLongString('reason') || `Not given`;
    const members = (await client.helpers.getMembers(ctx.guild.id, { limit: 1000 })).filter(
      (member) => !member.user?.toggles.bot || true,
    );
    const seconds = Number(members.length) * 1500;

    const message = await client.extras.embed(
      {
        title: 'Removing role from all humans.',
        desc: `Removing <@&${role.id}> to ${members.length} members. \n I will take ${seconds} seconds to complete this operation`,
        type: 'reply',
      },
      ctx,
    );
    let success = 0;
    let failed = 0;
    members.forEach((member) => {
      client.helpers
        .removeRole(ctx.guild!.id, member.id, role.id, reason)
        .then(() => success++)
        .catch(() => failed++);
    });

    const interval = setInterval(() => {
      if (success + failed == members.length) clearInterval(interval);

      client.extras.editEmbed(
        {
          title: 'Removing role from all humans.',
          desc: `Removing <@&${role.id}> to ${members.length} members. \n Successfully removed role from ${success} members. \n Failed to remove role from ${failed} members.`,
        },
        message,
      );
    }, 5000);
  },
} as CommandOptions;
