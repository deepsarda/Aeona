import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'deleteticket',
  description: 'Delete ticket',
  commandType: ['application', 'message'],
  category: 'tickets',
  args: [],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  private: true,
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const type = 'reply';

    ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
      if (data) {
        const ticketCategory = await client.helpers.getChannel(data.Category);

        if (ticketCategory == undefined) {
          return client.extras.errNormal(
            {
              error: 'Do the ticket setup!',
              type,
            },
            ctx,
          );
        }

        if (ctx.channel!.parentId == ticketCategory.id) {
          client.extras
            .simpleEmbed(
              {
                desc: `Delete this ticket in **5s**`,
                type,
              },
              ctx,
            )
            .then((_msg) =>
              setTimeout(async () => {
                await client.helpers.deleteChannel(ctx.channel!.id);
                ticketChannels.findOne(
                  {
                    Guild: ctx.guild!.id,
                    channelID: ctx.channel!.id,
                  },
                  async (err, data) => {
                    if (data) {
                      await ticketChannels.deleteOne({
                        Guild: ctx.guild!.id,
                        channelID: ctx.channel!.id,
                      });
                    }
                  },
                );
              }, 5000),
            );
        } else {
          client.extras.errNormal(
            {
              error: 'This is not a ticket!',
              type,
            },
            ctx,
          );
        }
      } else {
        return client.extras.errNormal(
          {
            error: 'Do the ticket setup!',
            type,
          },
          ctx,
        );
      }
    });
  },
} as CommandOptions;
