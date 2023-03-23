import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'sad',
  description: 'T_T',
  commandType: ['application', 'message'],
  category: 'anime2',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `${ctx.user.username} is sad`,
        image: (await hmfull.HMtai.sfw.depression()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
