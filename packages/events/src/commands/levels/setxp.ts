import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Functions from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'setxp',
  description: 'Set xp of a user.',
  commandType: ['application', 'message'],
  category: 'levels',
  args: [
    {
      name: 'user',
      description: 'The user you want to set the level of.',
      required: true,
      type: 'User',
    },
    {
      name: 'amount',
      description: 'The amount you want to set.',
      required: true,
      type: 'Number',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const data = await Functions.findOne({ Guild: ctx.guild!.id });

    if (data && data.Levels == true) {
      const target = await ctx.options.getUser('user', true);
      const xp = ctx.options.getNumber('amount', true);

      const user = await client.extras.setXP(target.id, ctx.guild!.id, xp);
      if (!user) return;
      client.extras.succNormal(
        {
          text: `XP has been modified successfully`,
          fields: [
            {
              name: '📈 New XP',
              value: `${user.xp}`,
              inline: true,
            },
            {
              name: '<:members:1063116392762712116> User',
              value: `<@${target.id}> (${`${target.username}#${target.discriminator}`})`,
              inline: true,
            },
          ],
          type: 'reply',
        },
        ctx,
      );
    } else {
      client.extras.errNormal(
        {
          error: 'Levels are disabled in this guild!',
          type: 'reply',
        },
        ctx,
      );
    }
  },
} as CommandOptions;
