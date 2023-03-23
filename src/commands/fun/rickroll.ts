import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'rickroll',
  description: 'Rickroll someone',
  commandType: ['application', 'message'],
  category: 'fun',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const roll = [
      'Never gonna give you up',
      'Never gonna let you down',
      'Never gonna run around and desert you',
      'Never gonna make you cry',
      'Never gonna say goodbye',
      'Never gonna tell a lie and hurt you',
    ];
    const rick = roll[Math.floor(Math.random() * roll.length)];

    client.extras.embed(
      {
        title: `${rick}`,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
