import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Banned from '../../database/models/banned.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'banidowner',
  description: 'Ban a server or user from Aeona.',
  commandType: ['application', 'message'],
  category: 'owner',
  args: [
    {
      name: 'id',
      type: 'String',
      required: true,
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    if (
      ![830231116660604951n, 794921502230577182n, 980280857958965328n].includes(
        ctx.user.id,
      )
    )
      return client.extras.succNormal(
        {
          text: 'Only Aeona Developers can access this command.',
          type: 'reply',
        },
        ctx,
      );
    const code = ctx.options.getString('id', true);
    const i = new Banned({
      ID: code,
    });
    i.save();
    client.extras.succNormal(
      {
        text: 'They have been banned from the bot.',
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
