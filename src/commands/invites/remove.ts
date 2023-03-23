import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/invites.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'remove',
  description: 'Remove invites from a user',
  commandType: ['application', 'message'],
  category: 'invites',
  args: [
    {
      name: 'user',
      description: 'The user you want to add invites to',
      required: true,
      type: 'User',
    },
    {
      name: 'amount',
      description: 'How many invites to add',
      required: true,
      type: 'Number',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const user = await ctx.options.getUser('user', true);
    const amount = ctx.options.getNumber('amount', true);
    if (!user || !amount) return;

    const data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user.id}`,
    });
    if (data) {
      data.Invites! -= amount;
      data.Total! -= amount;
      data.save();
    } else {
      return client.extras.errNormal(
        {
          error: `No invite data found for <@${user.id}>`,
          type: 'reply',
        },
        ctx,
      );
    }

    client.extras.succNormal(
      {
        text: `Removed **${amount}** invites from <@${user.id}>`,
        fields: [
          {
            name: '📨 Total invites',
            value: `${data.Invites}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
