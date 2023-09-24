/**
 * This module handles the AFK (Away From Keyboard) functionality in a Discord bot.
 *
 * @module Afk
 */

import {
  SimpleCommandMessage,
  ArgsOf,
  Bot,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  Discord,
} from 'discordx';
import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import Schema from '../../database/models/afk.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { AeonaBot } from '../../utils/types.js';

/**
 * Discord decorator for registering the Afk module.
 *
 * @class Afk
 */
@Discord()
@Bot(...getPluginsBot('afk'))
@Category('afk')
@Guard(RateLimit(TIME_UNIT.seconds, 30, { rateValue: 3 }))
export class Afk {
  /**
   * Command to set the user's AFK status.
   *
   * @param {string} [reason='No reason given! 🛌'] - The reason for going AFK.
   * @param {SimpleCommandMessage} command - The command message that triggered the function.
   * @returns {Promise<void>}
   */
  @SimpleCommand({
    name: 'afk',
    aliases: ['afk set'],
    description: 'Set your AFK 😴',
  })
  async afk(
    @SimpleCommandOption({
      name: 'reason',
      description: 'Reason for going afk',
      type: SimpleCommandOptionType.String,
    })
    reason = 'No reason given! 🛌',
    command: SimpleCommandMessage,
  ) {
    const ctx = command.message;
    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.author.id });
    reason = command.argString;
    // Check if the user is already AFK
    if (data) {
      return bot.extras.errNormal(
        {
          error: `You're already afk!`,
          type: 'reply',
        },
        command,
      );
    }

    // Save the user's AFK status in the database
    await new Schema({
      Guild: ctx.guildId,
      User: `${ctx.author.id}`,
      Message: reason,
    }).save();

    let nick = ctx.author.username;
    if (ctx.member?.nickname) {
      nick = ctx.member.nickname;
    }

    // Set the user's nickname to indicate they are AFK
    if (!nick.includes(`[AFK] `)) {
      ctx.member?.setNickname(`[AFK] ${nick}`).catch();
    }

    // Send a success message to the user
    bot.extras.embed(
      {
        title: 'Your AFK has been set up successfully',
        desc: '',
        type: 'ephemeral',
      },
      command,
    );

    // Send a notification to the server about the user going AFK
    bot.extras.embed(
      {
        title: '',
        desc: `<@${ctx.author.id}> is now afk! **Reason:** ${reason}`,
        type: '',
      },
      command,
    );
  }

  /**
   * Command to display a list of all AFK users in the server.
   *
   * @param {SimpleCommandMessage} command - The command message that triggered the function.
   * @returns {Promise<void>}
   */
  @SimpleCommand({
    name: 'afk list',
    description: 'See all the AFK users 😴',
  })
  async list(command: SimpleCommandMessage) {
    const ctx = command.message;
    const rawboard = await Schema.find({ Guild: ctx.guild!.id });

    // Check if there are no AFK users in the server
    if (rawboard.length < 1) {
      return bot.extras.errNormal(
        {
          error: 'No data found!',
          type: 'reply',
        },
        command,
      );
    }

    const lb = rawboard.map((e) => `<@!${e.User}> - **Reason** ${e.Message}`);

    // Create a leaderboard message with the list of AFK users
    await bot.extras.createLeaderboard(`AFK users - ${ctx.guild?.name}`, lb, command);
  }

  /**
   * Event listener for incoming messages.
   *
   * @param {ArgsOf<'messageCreate'>} message - The incoming message.
   * @param {AeonaBot} client - The Discord bot client.
   * @returns {Promise<void>}
   */
  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    // Ignore messages from other bots
    if (message.author.bot) {
      return;
    }

    // Check if any mentioned users are AFK and send a notification
    message.mentions.users.forEach(async (u) => {
      if (!message.content.includes('@here') && !message.content.includes('@everyone')) {
        const data = await Schema.findOne({ Guild: message.guildId, User: u.id });
        if (data) {
          client.extras.simpleMessageEmbed(
            {
              desc: `<@${u}> is currently afk! **Reason:** ${data.Message}`,
            },
            message,
          );
        }
      }
    });

    // Check if the author of the message is no longer AFK
    const data = await Schema.findOne({ Guild: message.guildId, User: message.author.id });
    if (!data) {
      return;
    }

    // Remove the user's AFK status from the database
    await Schema.deleteOne({
      Guild: message.guildId,
      User: message.author.id,
    });

    // Send a notification that the user is no longer AFK
    client.extras.simpleMessageEmbed(
      {
        desc: `<@${message.author.id}> is no longer afk!`,
      },
      message,
    );

    // Remove the "[AFK]" prefix from the user's nickname
    if (message.member?.nickname?.startsWith(`[AFK] `)) {
      const name = message.member?.nickname?.replace(`[AFK] `, ``);
      message.member?.setNickname(name).catch();
    }
  }
}
