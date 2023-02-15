import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import functions from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'premiumguilds',
  description: 'See the number of premium guilds',
  commandType: ['application', 'message'],
  category: 'owner',
  args: [],
  ownerOnly: true,
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const premiumGuilds: string[] = [];
    const premium = await functions.find({ isPremium: 'true' });
    for (let i = 0; i < premium.length; i++) {
      if (premium[i].isPremium === 'true') {
        const guild = await client.cache.guilds.get(BigInt(premium[i].Guild!));
        if (guild) premiumGuilds.push(`${guild.name} ${guild.id}`);
      }
    }
    client.extras.succNormal(
      {
        text: `There are a total of ${
          premiumGuilds.length
        } premium servers. \n\n${premiumGuilds.join('\n\n')}`,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
