import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SlashGroup, SlashOption } from 'discordx';
import { Discord, Slash, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import Schema from '../../database/models/birthday.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('birthdays'))
@SlashGroup({
  name: 'birthdays',
  description: 'Various commands related to birthdays. 🎂',
})
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
@SlashGroup('birthdays')
export class Birthdays {
  @Slash({
    name: 'check',
    description: 'See if I remember your birthday 📅',
  })
  async check(command: CommandInteraction) {
    const data = await Schema.findOne({ Guild: command.guildId, User: command.user.id });
    if (data)
      return bot.extras.embed(
        {
          title: `${bot.config.emotes.normal.birthday} Birthday check`,
          desc: `${command.user?.username} birthday is on ${data.Birthday}`,
          type: 'reply',
        },
        command,
      );

    return bot.extras.errNormal(
      {
        error: 'No birthday found!',
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'delete',
    description: 'Delete your birthday 📅',
  })
  async delete(command: CommandInteraction) {
    const data = await Schema.findOne({ Guild: command.guildId, User: command.user.id });
    if (!data)
      return bot.extras.errNormal(
        {
          error: 'No birthday found!',
          type: 'reply',
        },
        command,
      );

    await Schema.deleteOne({
      Guild: command.guildId,
      User: command.user.id,
    });

    return bot.extras.succNormal(
      {
        text: `${bot.config.emotes.normal.birthday} Birthday deleted`,
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'list',
    description: 'See all the birthdays of this servers members 🎂',
  })
  async list(command: CommandInteraction) {
    const rawBirthdayboard = await Schema.find({ Guild: command.guild!.id });

    if (rawBirthdayboard.length < 1)
      return bot.extras.errNormal(
        {
          error: 'No birthdays found!',
          type: 'reply',
        },
        command,
      );

    const lb = rawBirthdayboard.map((e) => `${bot.config.emotes.normal.birthday} | **<@!${e.User}>** → ${e.Birthday} `);

    await bot.extras.createLeaderboard(`🎂 Birthdays - ${command.guild?.name}`, lb, command);
  }

  @Slash({
    name: 'set',
    description: 'Set your birthday 🎂',
  })
  async set(
    @SlashOption({
      name: 'day',
      description: 'day you where born on',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    day: number,
    @SlashOption({
      name: 'month',
      description: 'month you where born on',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    month: number,
    command: CommandInteraction,
  ) {
    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    };

    if (!day || day > 31)
      return bot.extras.errNormal(
        {
          error: 'Wrong day format!',
          type: 'reply',
        },
        command,
      );

    if (!month || month > 12)
      return bot.extras.errNormal(
        {
          error: 'Wrong month format!',
          type: 'reply',
        },
        command,
      );

    const convertedDay = suffixes(day);
    //@ts-expect-error
    const convertedMonth = months[month];
    const birthdayString = `${convertedDay} of ${convertedMonth}`;

    const data = await Schema.findOne({ Guild: command.guildId, User: command.user.id });
    if (data) {
      data.Birthday = birthdayString;
      await data.save();
    } else {
      await Schema.create({
        Guild: command.guildId,
        User: command.user.id,
        Birthday: birthdayString,
      });
    }

    bot.extras.succNormal(
      {
        text: `Birthday has been set successfully`,
        fields: [
          {
            name: `${bot.config.emotes.normal.birthday} Birthday`,
            value: `${birthdayString}`,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'setchannel',
    description: 'Set a channel for wishing birthdays 🎂',
  })
  async setchannel(command: CommandInteraction) {
    return bot.extras.embed(
      {
        title: `Command Moved!`,
        desc: `Please use \`+setup birthdays <channel>\` instead.`,
      },
      command,
    );
  }
}
function suffixes(number: number) {
  const converted = number.toString();

  const lastChar = converted.charAt(converted.length - 1);

  return lastChar == '1'
    ? `${converted}st`
    : lastChar == '2'
    ? `${converted}nd`
    : lastChar == '3'
    ? `${converted}rd`
    : `${converted}th`;
}
