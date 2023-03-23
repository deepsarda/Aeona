import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'quote',
  description: 'Get a AI generated quote',
  commandType: ['application', 'message'],
  category: 'image',
  args: [],

  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const url = await (await fetch('https://inspirobot.me/api?generate=true')).text();

    client.extras.embed(
      {
        title: "Here's a quote for you",
        image: url,
      },
      ctx,
    );
  },
} as CommandOptions;
