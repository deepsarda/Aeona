import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import GTN from '../../database/models/guessNumber.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'guess-the-number',
  description: 'Setup guess-the-number for your server.',
  commandType: ['application', 'message'],
  category: 'setup',
  args: [
    {
      name: 'channel',
      description: 'The channel to setup',
      required: true,
      type: 'Channel',
    },
  ],
  userGuildPermissions: ['MANAGE_CHANNELS'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const channel = await ctx.options.getChannel('channel', true);
    client.extras.embed(
      {
        title: `🔢 Guess the number`,
        desc: `Guess the number between **1** and **10.000**!`,
      },
      channel,
    );
    client.extras.createChannelSetup(GTN, channel, ctx);
  },
} as CommandOptions;
