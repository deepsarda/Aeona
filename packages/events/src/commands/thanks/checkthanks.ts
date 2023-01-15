import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import thanksSchema from '../../database/models/thanks.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'checkthanks',
  description: 'Check how many times a user had been thanked',
  commandType: ['application', 'message'],
  category: 'thanks',
  args: [
    {
      name: 'user',
      description: 'The user you want to check',
      type: 'User',
      required: true,
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const member = await ctx.options.getUser('user');

    thanksSchema.findOne({ User: member!.id }, async (err, data) => {
      if (data) {
        return client.extras.embed(
          {
            title: `🤝 Thanks`,
            desc: `**${`${member!.username}#${member!.discriminator}`}** has \`${
              data.Received
            }\` thanks`,
            type: 'reply',
          },
          ctx,
        );
      }
      return client.extras.embed(
        {
          title: `🤝 Thanks`,
          desc: `**${`${member!.username}#${member!.discriminator}`}** has \`0\` thanks`,
          type: 'reply',
        },
        ctx,
      );
    });
  },
} as CommandOptions;
