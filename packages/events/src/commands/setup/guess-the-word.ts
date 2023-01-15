import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import GTW from '../../database/models/guessWord.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'guess-the-word',
  description: 'Setup guess-the-word for your server.',
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

    const word = 'start';
    const shuffled = word
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');

    client.extras.embed(
      {
        title: `Guess the word`,
        desc: `Put the letters in the right position!`,
        fields: [
          {
            name: `💬 Word`,
            value: `${shuffled.toLowerCase()}`,
          },
        ],
      },
      channel,
    );

    client.extras.createChannelSetup(GTW, channel, ctx);
  },
} as CommandOptions;
