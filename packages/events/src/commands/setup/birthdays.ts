import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Birthdays from '../../database/models/birthdaychannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'birthdays',
  description: 'Setup birthdays for your server.',
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

    client.extras.createChannelSetup(Birthdays, channel, ctx);
  },
} as CommandOptions;
