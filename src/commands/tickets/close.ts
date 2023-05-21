import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import ticketChannels from '../../database/models/ticketChannels.js';
import ticketMessageConfig from '../../database/models/ticketMessage.js';
import ticketSchema from '../../database/models/tickets.js';
import { AeonaBot } from '../../extras/index.js';
import { createTranscript } from '../../transcripts/index.js';

export default {
  name: 'close',
  description: 'Close the ticket',
  commandType: ['application', 'message'],
  category: 'tickets',
  args: [],
  private: true,
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const data = await ticketSchema.findOne({ Guild: ctx.guild!.id });
    const ticketData = await ticketChannels.findOne({
      Guild: ctx.guild!.id,
      channelID: ctx.channel.id,
    });

    const type = 'reply';

    if (ticketData) {
      if (ticketData.resolved == true)
        return client.extras.errNormal(
          {
            error: 'Ticket is already closed!',
            type: 'ephemeral',
          },
          ctx,
        );

      if (data) {
        const ticketCategory = await client.cache.channels.get(BigInt(data.Category!));
        const logsChannel = await client.cache.channels.get(BigInt(data.Logs!));

        if (ticketCategory == undefined) {
          return client.extras.errNormal(
            {
              error: 'Do the setup!',
              type,
            },
            ctx,
          );
        }
        client.helpers.editChannel(ctx.channel.id, {
          permissionOverwrites: [
            {
              type: 1,
              id: BigInt(ticketData.creator!),
              deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            },
          ],
        });

        try {
          let closeMessageTicket =
            'Here is the transcript for your ticket, please keep this if you ever want to refer to it!';
          const ticketMessageData = await ticketMessageConfig.findOne({
            Guild: ctx.guild!.id,
          });
          if (ticketMessageData) {
            closeMessageTicket = ticketMessageData.dmMessage!;
          }
          const channel = await client.helpers.getDmChannel(BigInt(ticketData.creator!));
          client.extras.embed(
            {
              desc: closeMessageTicket,
              fields: [
                {
                  name: '<:members:1063116392762712116> Closer',
                  value: `<@${ctx.user.id}>`,
                  inline: true,
                },
                {
                  name: '<:id:1062774182892552212> Ticket id',
                  value: `${ticketData.TicketID}`,
                  inline: true,
                },
                {
                  name: '🏛️ Server',
                  value: `${ctx.guild.name}`,
                  inline: true,
                },
              ],
            },
            channel,
          );
          client.extras.transcript(client, ctx.channel!).catch();
          const file = await createTranscript(client, ctx.channel!);
          client.helpers.sendMessage(channel.id, {
            files: [file],
          });
        } catch (err) {
          console.error(err);
        }

        if (logsChannel) {
          client.extras.embed(
            {
              title: `🔒 Ticket closed`,
              desc: `Ticket is closed`,
              color: client.extras.config.colors.error,
              fields: [
                {
                  name: '<:id:1062774182892552212> Ticket id',
                  value: `${ticketData.TicketID}`,
                },
                {
                  name: '<:members:1063116392762712116> Closer',
                  value: `${`${ctx.user.username}#${ctx.user.discriminator}`} (${ctx.user.id})`,
                },
                {
                  name: '<:members:1063116392762712116> Creator',
                  value: `<@!${ticketData.creator}>`,
                },
                {
                  name: '<:members:1063116392762712116> Claimed by',
                  value: `<@!${ticketData.creator}>`,
                },
                {
                  name: '🕒 Date',
                  value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
                },
              ],
            },
            logsChannel,
          );
          client.extras.transcript(client, logsChannel);
        }

        ticketData.resolved = true;
        ticketData.save();

        client.extras.simpleEmbed(
          {
            desc: `Ticket closed by <@!${ctx.user.id}>`,
            type,
          },
          ctx,
        );
        const comp = new Components();
        comp
          .addButton('', 'Primary', 'transcriptTicket', {
            emoji: '📝',
          })
          .addButton('', 'Primary', 'openTicket', {
            emoji: '🔓',
          })
          .addButton('', 'Danger', 'deleteTicket', {
            emoji: '⛔',
          });

        client.extras.embed(
          {
            title: '🔒 Closed',
            desc: `📝 - Save transcript \n🔓 - Reopen ticket \n⛔ - Delete ticket`,
            components: comp,
          },
          ctx.channel,
        );
      } else {
        return client.extras.errNormal(
          {
            error: 'Do the ticket setup!',
            type,
          },
          ctx,
        );
      }
    }
  },
} as CommandOptions;
