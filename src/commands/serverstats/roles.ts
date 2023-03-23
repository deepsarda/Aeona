import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'roles',
  description: 'Create a stats channel for the number of roles',
  commandType: ['application', 'message'],
  category: 'serverstats',
  args: [],
  userGuildPermissions: ['MANAGE_CHANNELS'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    let channelName = await client.extras.getTemplate(ctx.guild!.id);
    channelName = channelName.replace(`{emoji}`, '👔');
    channelName = channelName.replace(
      `{name}`,
      `Roles: ${(await client.helpers.getRoles(ctx.guild!.id)).size.toLocaleString()}`,
    );

    client.helpers
      .createChannel(ctx.guild!.id, {
        name: channelName,
        type: ChannelTypes.GuildVoice,
        permissionOverwrites: [
          {
            deny: ['CONNECT'],
            type: 0,
            id: ctx.guild!.id,
          },
        ],
      })
      .then(async (channel) => {
        Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
          if (data) {
            data.Roles = channel.id;
            data.save();
          } else {
            new Schema({
              Guild: ctx.guild!.id,
              Roles: channel.id,
            }).save();
          }
        });

        client.extras.succNormal(
          {
            text: `Roles count created!`,
            fields: [
              {
                name: `<:channel:1049292166343688192> Channel`,
                value: `<#${channel.id}>`,
              },
            ],
            type: 'reply',
          },
          ctx,
        );
      });
  },
} as CommandOptions;
