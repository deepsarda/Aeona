/**
 * This module handles the AFK (Away From Keyboard) functionality in a Discord bot.
 *
 * @module Afk
 */

import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Slash, SlashGroup, SlashOption } from 'discordx';
import { Discord } from 'discordx';
import Schema from '../../database/models/afk.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('afk'))
@SlashGroup({ description: 'Various Commands related to AFK', name: 'afk' })
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
@SlashGroup('afk')
export class Afk {
  /**
   * Sets the user as AFK.
   * @param reason - Reason for going AFK.
   * @param ctx - The interaction context.
   */
  @Slash({
    name: 'set',
    description: 'Set your AFK 😴',
  })
  async afk(
    @SlashOption({
      name: 'reason',
      description: 'Reason for going afk',
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    reason: string | undefined,
    ctx: CommandInteraction,
  ) {
    // Check if the user is already AFK
    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.user.id });
    if (data)
      return bot.extras.errNormal(
        {
          error: `You're already afk!`,
          type: 'reply',
        },
        ctx,
      );

    reason = reason || 'No reason given! 🛌';

    // Save AFK status in the database
    new Schema({
      Guild: ctx.guildId,
      User: `${ctx.user.id}`,
      Message: reason,
    }).save();

    let nick = ctx.user.username;
    if (ctx.member) {
      const member = await bot.guilds.cache.get(ctx.guildId!)?.members.fetch(ctx.user.id)!;
      if (member?.nickname) nick = member.nickname;
      if (!nick.includes(`[AFK] `)) member.setNickname(`[AFK] ${nick}`).catch();
    }

    // Send confirmation message to the user
    bot.extras.embed(
      {
        title: `Your AFK has been set up succesfully`,
        desc: '',
        type: 'ephemeral',
      },
      ctx,
    );

    // Send notification message to the server
    bot.extras.embed(
      {
        title: '',
        desc: `<@${ctx.user.id}> is now afk! **Reason:** ${reason}`,
        type: '',
      },
      ctx,
    );
  }

  /**
   * Lists all the AFK users on the server.
   * @param ctx - The interaction context.
   */
  @Slash({
    name: 'list',
    description: 'See all the AFK users 😴',
  })
  async list(ctx: CommandInteraction) {
    // Get all AFK users from the database
    const rawboard = await Schema.find({ Guild: ctx.guild!.id });

    // Check if there are any AFK users
    if (rawboard.length < 1)
      return bot.extras.errNormal(
        {
          error: 'No data found!',
          type: 'reply',
        },
        ctx,
      );

    // Create a leaderboard of AFK users and send it to the user
    const lb = rawboard.map((e) => `<@!${e.User}> - **Reason** ${e.Message}`);
    await bot.extras.createLeaderboard(`AFK users - ${ctx.guild?.name}`, lb, ctx);
  }
}
