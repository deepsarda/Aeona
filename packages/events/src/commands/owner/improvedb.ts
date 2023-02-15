import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import functions from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'improvedb',
  description: 'Remove all the excess databases.',
  commandType: ['application', 'message'],
  category: 'owner',
  args: [
    {
      name: 'code',
      type: 'String',
      required: true,
    },
  ],
  ownerOnly: true,
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const guilds = await functions.find();
    let guildsToRemove = 0;
    for (let i = 0; i < guilds.length; i++) {
      if (
        (guilds[i].isPremium == undefined ||
          guilds[i].isPremium == null ||
          guilds[i].isPremium == 'false' ||
          guilds[i].isPremium == 'no') &&
        (guilds[i].Prefix == undefined ||
          guilds[i].Prefix == null ||
          guilds[i].Prefix == '+' ||
          guilds[i].Prefix == ',')
      ) {
        guilds[i].delete();
        guildsToRemove++;
      }
    }

    ctx.reply({ content: `Succesfully removed ${guildsToRemove} guilds` });
  },
} as CommandOptions;
