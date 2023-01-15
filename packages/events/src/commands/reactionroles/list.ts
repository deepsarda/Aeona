import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/reactionRoles.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'list',
  description: 'See all the reaction roles.',
  commandType: ['application', 'message'],
  category: 'reactionroles',
  args: [],
  userGuildPermissions: ['MANAGE_ROLES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const reactions = await Schema.find({ Guild: ctx.guild!.id });
    if (!reactions)
      return client.extras.errNormal(
        {
          error: `No data found!`,
          type: 'reply',
        },
        ctx,
      );

    let list = ``;

    for (let i = 0; i < reactions.length; i++) {
      list += `**${i + 1}** - Name: ${reactions[i].Category} \n`;
    }

    await client.extras.embed(
      {
        title: '📃 Reaction roles',
        desc: list,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
