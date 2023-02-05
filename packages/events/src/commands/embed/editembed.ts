import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'editembed',
  description: 'Edit an embed',
  commandType: ['application', 'message'],
  category: 'embed',
  args: [
    {
      name: 'channel',
      description: 'Channel in which the message is in.',
      required: true,
      type: 'Channel',
    },
    {
      name: 'messageid',
      description: 'Id of that message.',
      required: true,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const channel = await ctx.options.getChannel('channel', true);
    const messageId = ctx.options.getString('messageid', true);

    const message = await client.helpers.getMessage(channel.id, messageId);
    if (!message)
      return client.extras.errNormal(
        {
          error: 'No message found!',
          type: 'reply',
        },
        ctx,
      );
    if (message.authorId != client.user.id)
      return client.extras.errNormal(
        {
          error: 'That message was not sent by me.',
          type: 'reply',
        },
        ctx,
      );
    const embed =
      message.embeds && message.embeds.length > 0 ? message.embeds[0] : {};

    client.extras.createInterface(ctx, '', {
      ...embed,
      content: message.content,
      callback: async (data) => {
        const config = await client.extras.getEmbedConfig(ctx);
        client.helpers.editMessage(
          channel.id,
          message.id,
          client.extras.generateEmbedFromData(config, data),
        );
      },
    });
  },
} as CommandOptions;
