import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/stickymessages.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'stick',
  description: 'Generate a chat message',
  commandType: ['application', 'message'],
  category: 'stickymessages',
  args: [
    {
      name: 'channel',
      description: 'The channel to remove sticky messages from',
      type: 'Channel',
      required: true,
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const channel = await ctx.options.getChannel('channel', true);

    Schema.findOne({ Guild: ctx.guild!.id, Channel: channel.id }, async (err, data) => {
      if (data) {
        Schema.findOneAndDelete({
          Guild: ctx.guild!.id,
          Channel: channel.id,
        }).then(() => {
          client.extras.succNormal(
            {
              text: 'Sticky message deleted',
              fields: [
                {
                  name: `<:channel:1049292166343688192> Channel`,
                  value: `<#${channel.id}>`,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
        });
      } else {
        client.extras.errNormal(
          {
            error: 'No message found!',
            type: 'reply',
          },
          ctx,
        );
      }
    });
  },
} as CommandOptions;
