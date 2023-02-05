import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'open',
  description: 'Open a closed ticket',
  commandType: ['application', 'message'],
  category: 'tickets',
  args: [],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const type = 'reply';

    ticketChannels.findOne(
      { Guild: ctx.guild!.id, channelID: ctx.channel.id },
      async (err, ticketData) => {
        if (ticketData) {
          if (ticketData.resolved == false)
            return client.extras.errNormal(
              {
                error: 'Ticket is already open!',
                type: 'ephemeral',
              },
              ctx,
            );

          ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
            if (data) {
              const ticketCategory = await client.cache.channels.get(
                data.Category,
              );

              if (ticketCategory == undefined) {
                return client.extras.errNormal(
                  {
                    error: 'Do the setup!',
                    type,
                  },
                  ctx,
                );
              }

              if (ctx.channel!.parentId == ticketCategory.id) {
                client.helpers.editChannel(ctx.channel!.id, {
                  permissionOverwrites: [
                    {
                      type: 1,
                      id: BigInt(ticketData.creator),
                      deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                  ],
                });

                const ticketid = String(ticketData.TicketID).padStart(4, '0');

                client.helpers.editChannel(ctx.channel?.id!, {
                  name: `ticket-${ticketid}`,
                });

                ticketData.resolved = false;
                ticketData.save();

                return client.extras.simpleEmbed(
                  {
                    desc: `Ticket opened by <@!${ctx.user?.id}>`,
                    type,
                  },
                  ctx,
                );
              }
              client.extras.errNormal(
                {
                  error: 'This is not a ticket!',
                  type,
                },
                ctx,
              );
            } else {
              return client.extras.errNormal(
                {
                  error: 'Do the setup!',
                  type,
                },
                ctx,
              );
            }
          });
        }
      },
    );
  },
} as CommandOptions;
