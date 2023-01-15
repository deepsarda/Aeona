import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'notice',
  description: 'Send a inactivity notification.',
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
          if (ctx.user!.id !== ticketData.creator) {
            ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
              if (data) {
                const ticketCategory = await client.helpers.getChannel(data.Category);

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
                  client.extras.simpleEmbed(
                    {
                      desc: `Hey <@${
                        ticketData.creator
                      }>, \n\nCan we still help you? \nIf there is no response within **24 hours**, we will close this ticket \n\n- Team ${
                        ctx.guild!.name
                      }`,
                      content: `<@${ticketData.creator}>`,
                      type,
                    },
                    ctx,
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
                    error: 'Do the setup!',
                    type,
                  },
                  ctx,
                );
              }
            });
          } else {
            return client.extras.errNormal(
              {
                error: 'You are not allowed to notice your own ticket!',
                type: 'ephemeral',
              },
              ctx,
            );
          }
        }
      },
    );
  },
} as CommandOptions;
