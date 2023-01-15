import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import hmfull from 'hmfull';

export default {
  name: 'wink',
  description: 'Wink',
  commandType: ['application', 'message'],
  category: 'anime2',
  args: [],
  async execute(client, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `${ctx.user.username} winks`,
        image: (await hmfull.HMtai.sfw.wink()).url,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
