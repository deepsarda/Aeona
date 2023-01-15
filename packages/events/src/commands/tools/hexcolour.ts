import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import axios from 'axios';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'hexcolor',
  description: 'Get information about some hex colors',
  commandType: ['application', 'message'],
  category: 'tools',
  args: [
    {
      name: 'color',
      description: 'the color to use',
      required: true,
      type: 'String',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const color = ctx.options.getString('color', true);

    // @ts-ignore
    const { data } = await axios
      .get(`https://some-random-api.ml/canvas/rgb?hex=${color}`)
      .catch(() => {
        return client.extras.errNormal(
          {
            error: 'Color not found!',
            type: 'reply',
          },
          ctx,
        );
      });

    client.extras.embed(
      {
        title: `🎨 Color info`,
        image: `https://some-random-api.ml/canvas/colorviewer?hex=${color}`,
        color: `#${color}`,
        fields: [
          {
            name: 'Hex',
            value: `#${color}`,
            inline: true,
          },
          {
            name: 'RGB',
            value: `${data.r}, ${data.g}, ${data.b}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
