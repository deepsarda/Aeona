import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
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
export class AutoMod {
  @Slash({
    name: 'antiinvite',
    description: ':stop_sign: Stop users from postings discord invites.',
    defaultMemberPermissions: ['ManageMessages'],
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('automod')
  async antiinvite(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable antiinvite for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ) {
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

  @Slash({
    name: 'antilinks',
    description: ':stop_sign: Stop users from postings links 🔗',
    defaultMemberPermissions: ['ManageMessages'],
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('automod')
  async antilink(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable anti links for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ) {
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

  @Slash({
    name: 'antispam',
    description: ':stop_sign: Stop users from spamming.',
    defaultMemberPermissions: ['ManageMessages'],
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('automod')
  async antispam(
    @SlashOption({
      name: 'active',
      description: 'Enable or disable antispam for your server',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    boolean: boolean,
    command: CommandInteraction,
  ) {
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
