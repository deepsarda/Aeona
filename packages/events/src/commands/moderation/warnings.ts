import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/warnings.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'warnings',
  description: 'Generate a chat message',
  commandType: ['application', 'message'],
  category: 'moderation',
  args: [
    {
      name: 'user',
      description: 'The user to see warnings of.',
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
      async (err: any, data: { Warns: any }) => {
        if (data) {
          client.extras.embed(
            {
              title: `Warnings`,
              desc: `The warnings of **${`${member.username}#${member.discriminator}`}**`,
              fields: [
                {
                  name: 'Total',
                  value: `${data.Warns}`,
                  inline: false,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
        } else {
          client.extras.embed(
            {
              title: `Warnings`,
              desc: `The warnings of **${`${member.username}#${member.discriminator}`}**`,
              fields: [
                {
                  name: 'Total',
                  value: '0',
                  inline: false,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
        }
      },
    );
  },
} as CommandOptions;
