import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'happy',
  description: 'Show your happiness',
  commandType: ['application', 'message'],
  category: 'anime',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `${ctx.user.username} is happy`,
        image: (await hmfull.HMtai.sfw.happy()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
