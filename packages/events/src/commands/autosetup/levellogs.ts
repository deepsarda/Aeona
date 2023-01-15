import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import levelLogs from '../../database/models/levelChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'boostlogs',
  description: 'Setup boostlog channel',
  commandType: ['application', 'message'],
  category: 'autosetup',
  args: [],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await client.helpers.createChannel(ctx.guild!.id!, {
      name: 'levelLogs',
      // @ts-ignore
      type: ChannelTypes.GuildText,
    });

    client.extras.createChannelSetup(levelLogs, channel, ctx);
  },
} as CommandOptions;
