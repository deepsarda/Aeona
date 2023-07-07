/**
 * The AutoMod class provides a set of commands (with JSDoc) to enable or disable various automod configurations for a Discord server.
 * @category automod
 * @requires @discordx/utilities, 'discordx', '../database/models/guild.js', '../utils/config.js', '../bot.js', 'discord.js'
 */
import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Slash, SlashGroup, SlashOption } from 'discordx';
import { Discord } from 'discordx';
import Schema from '../../database/models/guild.js';
import { getPluginsBot } from '../../utils/config.js';
import { bot } from '../../bot.js';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('automod'))
@Category('automod')
@SlashGroup({
  description: 'Enable or disable various automod configurations for your server',
  name: 'automod',
})
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageMessages']),
)
@SlashGroup('automod')
export class AutoMod {
  /**
   * The antiinvite command enables or disables the prevention of users posting discord invites.
   * @param {boolean} boolean - A boolean indicating whether to enable or disable antiinvite.
   * @param {CommandInteraction} command - The interaction of the executed command.
   * @return {Promise<void>} - A Promise that resolves once the antiinvite command is executed.
   */
  @Slash({
    name: 'antiinvite',
    description: ':stop_sign: Stop users from postings discord invites.',
  })
  async antiinvite(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable antiinvite for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ): Promise<void> {
    const data = await Schema.findOne({ Guild: command.guildId });
    if (data) {
      data.AntiInvite = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.guildId,
        AntiInvite: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti invite is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }

  /**
   * The antilink command enables or disables the prevention of users posting links.
   * @param {boolean} boolean - A boolean indicating whether to enable or disable antilink.
   * @param {CommandInteraction} command - The interaction of the executed command.
   * @return {Promise<void>} - A Promise that resolves once the antilink command is executed.
   */
  @Slash({
    name: 'antilinks',
    description: ':stop_sign: Stop users from postings links 🔗',
  })
  async antilink(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable anti links for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ): Promise<void> {
    const data = await Schema.findOne({ Guild: command.guildId });
    if (data) {
      data.AntiLinks = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.guildId,
        AntiLinks: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti links is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }

  /**
   * The antispam command enables or disables the prevention of users spamming.
   * @param {boolean} boolean - A boolean indicating whether to enable or disable antispam.
   * @param {CommandInteraction} command - The interaction of the executed command.
   * @return {Promise<void>} - A Promise that resolves once the antispam command is executed.
   */
  @Slash({
    name: 'antispam',
    description: ':stop_sign: Stop users from spamming.',
  })
  async antispam(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable antispam for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ): Promise<void> {
    const data = await Schema.findOne({ Guild: command.guildId });
    if (data) {
      data.AntiSpam = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.guildId,
        AntiSpam: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti spam is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }
}
