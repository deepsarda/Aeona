import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'corona',
  description: 'See the latest corona data',
  commandType: ['application', 'message'],
  category: 'tools',
  args: [
    {
      name: 'country',
      description: 'the country to get data for',
      required: true,
      type: 'String',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const countries = ctx.options.getLongString('country', true);

    fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
      .then((response) => response.json())
      .then((data: any) => {
        const confirmed = data.confirmed.value.toLocaleString();
        const recovered = data.recovered.value.toLocaleString();
        const deaths = data.deaths.value.toLocaleString();

        return client.extras.embed(
          {
            title: `COVID-19 - ${countries}`,
            fields: [
              {
                name: 'Confirmed Cases',
                value: `${confirmed}`,
                inline: true,
              },
              {
                name: 'Recovered',
                value: `${recovered}`,
                inline: true,
              },
              {
                name: 'Deaths',
                value: `${deaths}`,
                inline: true,
              },
            ],
            type: 'reply',
          },
          ctx,
        );
      })
      .catch(() => {
        return client.extras.errNormal({ error: `Invalid country provided!`, type: 'reply' }, ctx);
      });
  },
} as CommandOptions;
