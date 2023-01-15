import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'starboard',
  description: 'Setup the starboard',
  commandType: ['application', 'message'],
  category: 'autosetup',
  args: [],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await client.helpers.createChannel(ctx.guild!.id!, {
      name: 'Starboard',
      type: ChannelTypes.GuildText,
    });

    client.extras.createChannelSetup(StarBoard, channel, ctx);
  },
} as CommandOptions;
