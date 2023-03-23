import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/birthday.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'list',
  description: 'See all the birthdays',
  commandType: ['application', 'message'],
  category: 'birthdays',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const rawBirthdayboard = await Schema.find({ Guild: ctx.guild!.id });

    if (rawBirthdayboard.length < 1)
      return client.extras.errNormal(
        {
          error: 'No birthdays found!',
          type: 'reply',
        },
        ctx,
      );

    const lb = rawBirthdayboard.map(
      (e) => `${client.extras.emotes.normal.birthday} | **<@!${e.User}>** → ${e.Birthday} `,
    );

    await client.extras.createLeaderboard(`🎂 Birthdays - ${ctx.guild.name}`, lb, ctx);
  },
} as CommandOptions;
