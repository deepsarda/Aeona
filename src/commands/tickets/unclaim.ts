import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'unclaim',
  description: 'Remove you claim from this ticket.',
  commandType: ['application', 'message'],
  category: 'tickets',
  args: [],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const data = await ticketSchema.findOne({ Guild: ctx.guild!.id });
    const ticketData = await ticketChannels.findOne({
      Guild: ctx.guild!.id,
      channelID: ctx.channel.id,
    });

    if (ticketData) {
      if (`${ctx.user.id}` !== ticketData.creator) {
        if (data) {
          if (
            ticketData.claimed == '' ||
            ticketData.claimed == undefined ||
            ticketData.claimed == 'None'
          ) {
            client.extras.errNormal(
              {
                error: 'Ticket not claimed!',
                type: 'ephemeral',
              },
              ctx,
            );
          } else if (ticketData.claimed == `${ctx.user.id}`) {
            const ticketCategory = await client.cache.channels.get(
              BigInt(data.Category!),
            );

            if (!ticketCategory) {
              return client.extras.errNormal(
                {
                  error: 'Do the setup!',
                  type: 'reply',
                },
                ctx,
              );
            }

            if (ctx.channel.parentId == ticketCategory.id) {
              ticketData.claimed = 'None';
              ticketData.save();

              return client.extras.simpleEmbed(
                {
                  desc: `This ticket can now be claimed again!`,
                  type: 'reply',
                },
                ctx,
              );
            }
            client.extras.errNormal(
              {
                error: 'This is not a ticket!',
                type: 'reply',
              },
              ctx,
            );
          } else {
            client.extras.errNormal(
              {
                error: 'You have not claimed this ticket!',
                type: 'reply',
              },
              ctx,
            );
          }
        } else {
          return client.extras.errNormal(
            {
              error: 'Do the ticket setup!',
              type: 'reply',
            },
            ctx,
          );
        }
      }
    }
  },
} as CommandOptions;
