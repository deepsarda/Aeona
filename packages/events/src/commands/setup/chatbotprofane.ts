import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import GuildDB from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'chatbotprofane',
  description: 'Toggle the ablity for chatbot to swear and use profane words.',
  commandType: ['application', 'message'],
  category: 'setup',
  args: [],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    let guild = await GuildDB.findOne({ Guild: ctx.guild.id });
    if (!guild)
      guild = new GuildDB({
        Guild: ctx.guild.id,
      });

    if (!(guild.isPremium === 'true')) {
      client.extras.errNormal(
        {
          error:
            'This guild is not a premium. \n You can buy it for just $1 [here](https://patreon.com/aeonicdiscord)',
        },
        ctx,
      );
    }

    let state = guild.chatbotFilter;
    state = !state;
    guild.chatbotFilter = state;
    await guild.save();
    client.extras.succNormal(
      {
        text: `Succesfully set the chatbot filter to \`${state}\``,
      },
      ctx,
    );
  },
} as CommandOptions;
