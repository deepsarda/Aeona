import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'setstatchannelname',
  description: 'Sets the channel name for stats',
  commandType: ['application', 'message'],
  category: 'setup',
  args: [
    {
      name: 'message',
      description: '<message>/help',
      required: true,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const name = ctx.options.getString('name', true);
    if (!name) return;

    if (name.toUpperCase() == 'HELP') {
      return client.extras.embed(
        {
          title: `Channel name options`,
          desc: `These are the channel name options: \n
            \`{emoji}\` - Channel emoji
            \`{name}\` - Channel name`,
          type: 'reply',
        },
        ctx,
      );
    }

    Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
      if (data) {
        data.ChannelTemplate = name;
        data.save();
      } else {
        new Schema({
          Guild: ctx.guild!.id,
          ChannelTemplate: name,
        }).save();
      }

      client.extras.succNormal(
        {
          text: `The channel name has been set successfully`,
          fields: [
            {
              name: `<:name:1062774821190111272>  Name`,
              value: `${name}`,
              inline: true,
            },
          ],
          type: 'reply',
        },
        ctx,
      );
    });
  },
} as CommandOptions;
