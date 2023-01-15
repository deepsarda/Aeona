import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'pandafact',
  description: 'Get A pandafact',
  commandType: ['application', 'message'],
  category: 'fun',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    fetch(`https://some-random-api.ml/facts/panda`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        client.extras.embed(
          {
            title: `Random panda fact`,
            desc: json.fact,
            type: 'reply',
          },
          ctx,
        );
      })
      .catch();
  },
} as CommandOptions;
