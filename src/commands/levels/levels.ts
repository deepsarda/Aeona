import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'levels',
  description: 'Enable or disable level messages',
  commandType: ['application', 'message'],
  category: 'levels',
  args: [
    {
      name: 'boolean',
      description: 'Enable or disable level messages',
      required: true,
      type: 'Boolean',
    },
  ],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const boolean = ctx.options.getBoolean('boolean', true);

    const data = await Schema.findOne({ Guild: ctx.guild!.id });
    if (data) {
      data.Levels = boolean;
      data.save();
    } else {
      new Schema({
        Guild: ctx.guild!.id,
        Levels: boolean,
      }).save();
    }

    client.extras.succNormal(
      {
        text: `Levels is now **${
          boolean ? 'enabled' : 'disabled'
        }** in this guild`,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
