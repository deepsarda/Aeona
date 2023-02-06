import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/inviteRewards.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'deletereward',
  description: 'Delete a reward ',
  commandType: ['application', 'message'],
  category: 'invites',
  args: [
    {
      name: 'amount',
      description: 'The number of invites',
      required: true,
      type: 'Number',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const messages = ctx.options.getNumber('amount');

    Schema.findOne(
      { Guild: ctx.guild!.id, Messages: messages },
      async (err: any, data: any) => {
        if (data) {
          Schema.findOneAndDelete({
            Guild: ctx.guild!.id,
            Messages: messages,
          }).then(() => {
            client.extras.succNormal(
              {
                text: `Invite reward removed`,
                fields: [
                  {
                    name: '💬 Invites',
                    value: `${messages}`,
                    inline: true,
                  },
                  {
                    name: '📈 Invites Amount',
                    value: `${messages}`,
                    inline: true,
                  },
                ],
                type: 'reply',
              },
              ctx,
            );
          });
        } else {
          return client.extras.errNormal(
            {
              error: 'No invite reward found at this invite amount!',
              type: 'reply',
            },
            ctx,
          );
        }
      },
    );
  },
} as CommandOptions;
