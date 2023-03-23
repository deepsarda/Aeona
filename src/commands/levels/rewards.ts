import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/levelRewards.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'rewards',
  description: 'See all the level rewards.',
  commandType: ['application', 'message'],
  category: 'levels',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const rawLeaderboard = await Schema.find({ Guild: ctx.guild!.id });

    if (rawLeaderboard.length < 1)
      return client.extras.errNormal(
        {
          error: `No rewards found!`,
          type: 'reply',
        },
        ctx,
      );

    const lb = rawLeaderboard.map((e) => `**Level ${e.Level}** - <@&${e.Role}>`);

    await client.extras.createLeaderboard(`Level rewards - ${ctx.guild.name}`, lb, ctx);
  },
} as CommandOptions;
