import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'roll',
  description: 'Roll a dice',
  commandType: ['application', 'message'],
  category: 'game',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const result = Math.ceil(Math.random() * 6);

    client.extras.embed(
      {
        title: `Roll`,
        desc: `You rolled ${result}`,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
