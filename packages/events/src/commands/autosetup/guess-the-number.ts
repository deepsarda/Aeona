import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';

import GTN from '../../database/models/guessNumber.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'guess-the-number',
  description: 'Setup the chatbot',
  commandType: ['application', 'message'],
  category: 'autosetup',
  args: [],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await client.helpers.createChannel(ctx.guild!.id!, {
      name: 'Guess-The-Number',
      type: ChannelTypes.GuildText,
    });

    client.extras.embed(
      {
        title: `Guess the number`,
        desc: `Guess the number between **1** and **10,000**!`,
      },
      channel,
    );

    client.extras.createChannelSetup(GTN, channel, ctx);
  },
} as CommandOptions;
