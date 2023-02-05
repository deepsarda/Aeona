import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'information',
  description: 'Gain info about this ticket.',
  commandType: ['application', 'message'],
  category: 'tickets',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    ticketChannels.findOne(
      { Guild: ctx.guild!.id, channelID: ctx.channel.id },
      async (err, ticketData) => {
        if (ticketData) {
          ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
            if (data) {
              const ticketCategory = await client.cache.channels.get(
                data.Category,
              );

              if (ticketCategory == undefined) {
                return client.extras.errNormal(
                  {
                    error: 'Do the setup!',
                    type: 'reply',
                  },
                  ctx,
                );
              }

              if (ctx.channel!.parentId == ticketCategory.id) {
                client.extras
                  .embed(
                    {
                      desc: `${client.extras.emotes.animated.loading} Loading information...`,
                      type: 'reply',
                    },
                    ctx,
                  )
                  .then((_msg) => {
                    client.extras.transcript(client, ctx.channel!);

                    return client.extras.embed(
                      {
                        title: `ℹ Information`,
                        fields: [
                          {
                            name: 'Ticket name',
                            value: `\`${ctx.channel!.name}\``,
                            inline: true,
                          },
                          {
                            name: 'Channel id',
                            value: `\`${ctx.channel!.id}\``,
                            inline: true,
                          },
                          {
                            name: 'Creator',
                            value: `<@!${ticketData.creator}>`,
                            inline: true,
                          },
                          {
                            name: 'Claimed by',
                            value: `<@!${ticketData.claimed}>`,
                            inline: true,
                          },
                          {
                            name: 'Ticket id',
                            value: `${ticketData.TicketID}`,
                            inline: true,
                          },
                        ],
                        type: 'editreply',
                      },
                      ctx,
                    );
                  });
              } else {
                client.extras.errNormal(
                  {
                    error: 'This is not a ticket!',
                    type: 'reply',
                  },
                  ctx,
                );
              }
            } else {
              return client.extras.errNormal(
                {
                  error: 'Do the setup!',
                  type: 'reply',
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
