import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'nosebleed',
  description: "That's...impressive",
  commandType: ['application', 'message'],
  category: 'anime2',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `${ctx.user.username}, that's...impressive`,
        image: (await hmfull.HMtai.sfw.nosebleed()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
