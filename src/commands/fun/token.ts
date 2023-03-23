import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'token',
  description: 'Generate a bot token',
  commandType: ['application', 'message'],
  category: 'fun',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    fetch(`https://some-random-api.ml/bottoken`)
      .then((res) => res.json())
      .catch()
      .then(async (json: any) => {
        client.extras.embed(
          {
            title: `Bot token`,
            desc: json.token,
            type: 'reply',
          },
          ctx,
        );
      })
      .catch();
  },
} as CommandOptions;
