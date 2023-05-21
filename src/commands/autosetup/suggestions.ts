import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from '@discordeno/bot';

import Suggestion from '../../database/models/suggestionChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'suggestions',
  description: 'Setup the suggestions channel',
  commandType: ['application', 'message'],
  category: 'autosetup',
  args: [],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await client.helpers.createChannel(ctx.guild!.id!, {
      name: 'Suggestions',
      type: ChannelTypes.GuildText,
    });

    client.extras.createChannelSetup(Suggestion, channel, ctx);
  },
} as CommandOptions;
