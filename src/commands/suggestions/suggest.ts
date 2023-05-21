import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { avatarUrl } from '@discordeno/bot';
import Schema from '../../database/models/suggestionChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'suggest',
  description: 'Generate a chat message',
  commandType: ['application', 'message'],
  category: 'suggestions',
  args: [
    {
      name: 'suggestion',
      type: 'String',
      description: 'The suggestion you want to suggest',
      required: true,
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const suggestionQuery = await ctx.options.getString('suggestion', true);

    const data = await Schema.findOne({ Guild: ctx.guild!.id });
    if (data) {
      const channel = await client.cache.channels.get(BigInt(data.Channel!));

      client.extras
        .embed(
          {
            title: `💡 Suggestion`,
            desc: `${suggestionQuery}`,
            author: {
              name: `${ctx.user.username}#${ctx.user.discriminator}(${ctx.user.id})`,
              iconURL: avatarUrl(`${ctx.user.id}`, ctx.user.discriminator, {
                avatar: ctx.user.avatar,
              }),
            },
          },
          channel!,
        )
        .then((msg) => {
          client.extras.succNormal(
            {
              text: `Suggestion successfully submitted!`,
              fields: [
                {
                  name: `💬 Suggestion`,
                  value: `${suggestionQuery}`,
                  inline: true,
                },
                {
                  name: `<:channel:1049292166343688192> Channel`,
                  value: `<#${data.Channel}>`,
                  inline: true,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
          const m = msg instanceof Context ? ctx.message! : msg;
          client.helpers.addReaction(m.channelId, m.id, '🔺');
          client.helpers.addReaction(m.channelId, m.id, '🔻');
        })
        .catch((_e) => {
          return client.extras.errNormal(
            {
              error: `No suggestion channel set! Please do the setup`,
              type: 'reply',
            },
            ctx,
          );
        });
    } else {
      client.extras.errNormal(
        {
          error: `No suggestion channel set! Please do the setup`,
          type: 'reply',
        },
        ctx,
      );
    }
  },
} as CommandOptions;
