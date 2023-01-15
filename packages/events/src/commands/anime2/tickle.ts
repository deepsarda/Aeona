import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'tickle',
  description: 'Tiiickle tickle tickle :3',
  commandType: ['application', 'message'],
  category: 'anime2',
  args: [
    {
      name: 'user',
      description: 'The User',
      required: true,
      type: 'User',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const user = await ctx.options.getUser('user', true);
    client.extras.embed(
      {
        title: `${ctx.user.username} tickes ${user.username}`,
        image: (await hmfull.HMtai.sfw.tickle()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
