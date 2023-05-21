import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from '@discordeno/bot';

import Review from '../../database/models/reviewChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'reviews',
  description: 'Setup the review channel',
  commandType: ['application', 'message'],
  category: 'autosetup',
  args: [],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await client.helpers.createChannel(ctx.guild!.id!, {
      name: 'Reviews',
      type: ChannelTypes.GuildText,
    });

    client.extras.createChannelSetup(Review, channel, ctx);
  },
} as CommandOptions;
