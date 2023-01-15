import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'cry',
  description: 'cry',
  commandType: ['application', 'message'],
  category: 'anime',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `${ctx.user.username} cries`,
        image: (await hmfull.HMtai.sfw.cry()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
