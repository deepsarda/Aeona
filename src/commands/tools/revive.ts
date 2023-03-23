import MarkovGen from 'markov-generator';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'revive',
  description: 'Revive your chat',
  commandType: ['application', 'message'],
  category: 'tools',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const msgs = (
      await client.helpers.getMessages(ctx.channel.id, {
        limit: 100,
      })
    )
      .filter((msg) => msg.content.length > 0)
      .map((msg) => msg.content);

    const markov = new MarkovGen({
      input: msgs,
      minLength: 10,
    });
    client.helpers.sendMessage(ctx.channel.id, {
      content: markov.makeChain(),
    });
  },
} as CommandOptions;
