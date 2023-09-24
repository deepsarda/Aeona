import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import {
  Bot,
  Guard,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
  SimpleCommandOptionType,
  Slash,
  SlashGroup,
  SlashOption,
} from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';
import BirthdayChannels from '../../database/models/birthdaychannels.js';
import { bot } from '../../bot.js';
import { ApplicationCommandOptionType, CommandInteraction, GuildChannel } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('birthdays'))
@Category('setup')
@SlashGroup({
  name: 'setup',
  description: 'Various commands setup up my various features. 🛠️',
})
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageChannels']),
)
@SlashGroup('setup')
export class Birthdays {
  @SimpleCommand({
    name: 'setup birthdays',
    description: 'Set a channel for wishing your birthdays 🎂',
  })
  async setchannel(
    @SimpleCommandOption({
      name: 'channel',
      description: 'Channel to set as the birthday channel.',
      type: SimpleCommandOptionType.Channel,
    })
    channel: GuildChannel | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!channel) {
      const data = await BirthdayChannels.findOne({ Guild: command.message.guild!.id });
      if (data) {
        data.Channel = undefined;
        await data.save();
      }

      return bot.extras.succNormal(
        {
          text: `${bot.config.emotes.normal.birthday} Birthday channel removed! \n To set a new channel, use \`+setup birthdays <channel>\``,
        },
        command,
      );
    }

    const data = await BirthdayChannels.findOne({ Guild: channel.guild!.id });

    if (data) {
      data.Channel = channel.id;
      await data.save();
    } else {
      await BirthdayChannels.create({ Guild: channel.guild!.id, Channel: channel.id });
    }

    return bot.extras.succNormal(
      {
        text: `${bot.config.emotes.normal.birthday} Birthday channel set successfully to ${channel}!`,
      },
      command,
    );
  }

  @Slash({
    name: 'birthdays',
    description: 'Set a channel for wishing your birthdays 🎂',
  })
  async list(
    @SlashOption({
      name: 'channel',
      description: 'Channel to set as the birthday channel.',
      type: ApplicationCommandOptionType.Channel,
    })
    channel: GuildChannel | undefined,
    command: CommandInteraction,
  ) {
    if (!channel) {
      const data = await BirthdayChannels.findOne({ Guild: command.guild!.id });
      if (data) {
        data.Channel = undefined;
        await data.save();
      }

      return bot.extras.succNormal(
        {
          text: `${bot.config.emotes.normal.birthday} Birthday channel removed! \n To set a new channel, use \`+setup birthdays <channel>\``,
        },
        command,
      );
    }

    const data = await BirthdayChannels.findOne({ Guild: channel.guild!.id });

    if (data) {
      data.Channel = channel.id;
      await data.save();
    } else {
      await BirthdayChannels.create({ Guild: channel.guild!.id, Channel: channel.id });
    }

    return bot.extras.succNormal(
      {
        text: `${bot.config.emotes.normal.birthday} Birthday channel set successfully to ${channel}!`,
      },
      command,
    );
  }
}
