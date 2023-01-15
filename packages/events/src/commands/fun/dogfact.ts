import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'dogfact',
  description: 'Generate a dog fact',
  commandType: ['application', 'message'],
  category: 'fun',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    fetch(`https://some-random-api.ml/facts/dog`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        client.extras.embed(
          {
            title: `Random dog fact`,
            desc: json.fact,
            type: 'reply',
          },
          ctx,
        );
      })
      .catch();
  },
} as CommandOptions;
