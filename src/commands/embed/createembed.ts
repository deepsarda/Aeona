import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'createembed',
  description: 'Create a brand new embed.',
  commandType: ['application', 'message'],
  category: 'embed',
  args: [
    {
      name: 'channel',
      description: 'Channel in which to send the message.',
      required: true,
      type: 'Channel',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await ctx.options.getChannel('channel', true);
    client.extras.createInterface(ctx, '_ _', {
      callback: async (data) => {
        const config = await client.extras.getEmbedConfig(ctx);
        client.helpers.sendMessage(
          channel.id,
          client.extras.generateEmbedFromData(config, data),
        );

        ctx.reply({ content: 'Successfully created embed.' });
      },
    });
  },
} as CommandOptions;
