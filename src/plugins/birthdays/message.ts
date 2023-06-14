import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommandMessage, SlashGroup } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import Schema from '../../database/models/birthday.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import BirthdayChannels from '../../database/models/birthdaychannels.js';
import { TextChannel } from 'discord.js';

let checkingBirthdays = false;
@Discord()
@Bot(...getPluginsBot('birthdays'))
@Category('birthdays')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Birthdays {
  @SimpleCommand({
    name: 'birthday check',
    aliases: ['bday check', 'birthdays check'],
    description: 'See if I remember your birthday 📅',
  })
  async check(command: SimpleCommandMessage) {
    let ctx = command.message;

    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.author.id });
    if (data)
      return bot.extras.embed(
        {
          title: `${bot.config.emotes.normal.birthday} Birthday check`,
          desc: `${ctx.author?.username} birthday is on ${data.Birthday}`,
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

  @SimpleCommand({
    name: 'birthday delete',
    aliases: ['bday delete', 'birthdays delete'],
    description: 'Delete your birthday 📅',
  })
  async delete(command: SimpleCommandMessage) {
    let ctx = command.message;

    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.author.id });
    if (!data)
      return bot.extras.errNormal(
        {
          error: 'No birthday found!',
          type: 'reply',
        },
        command,
      );

    await Schema.deleteOne({
      Guild: ctx.guildId,
      User: ctx.author.id,
    });

    return bot.extras.succNormal(
      {
        text: `${bot.config.emotes.normal.birthday} Birthday deleted`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'birthday list',
    aliases: ['bday list', 'birthdays list', 'birthdays'],
    description: 'See all the birthdays of this servers members 🎂',
  })
  async list(command: SimpleCommandMessage) {
    let ctx = command.message;
    const rawBirthdayboard = await Schema.find({ Guild: ctx.guild!.id });

    if (rawBirthdayboard.length < 1)
      return bot.extras.errNormal(
        {
          error: 'No birthdays found!',
          type: 'reply',
        },
        command,
      );

    const lb = rawBirthdayboard.map((e) => `${bot.config.emotes.normal.birthday} | **<@!${e.User}>** → ${e.Birthday} `);

    await bot.extras.createLeaderboard(`🎂 Birthdays - ${ctx.guild?.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'birthday set',
    aliases: ['bday set', 'birthdays set'],
    description: 'Set your birthday 🎂',
  })
  async set(
    @SimpleCommandOption({
      name: 'day',
      description: 'day you where born on',
      type: SimpleCommandOptionType.Number,
    })
    day: number | undefined,
    @SimpleCommandOption({
      name: 'month',
      description: 'month you where born on',
      type: SimpleCommandOptionType.Number,
    })
    month: number | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;

    if (!day || !month)
      return bot.extras.errUsage(
        {
          usage: `+birthday set <day> <month>`,
        },
        command,
      );

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

    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.author.id });
    if (data) {
      data.Birthday = birthdayString;
      await data.save();
    } else {
      await Schema.create({
        Guild: ctx.guildId,
        User: ctx.author.id,
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

  @SimpleCommand({
    name: 'birthday setchannel',
    aliases: [
      'bday setchannel',
      'birthdays setchannel',
      'bday channel',
      'birthdays channel',
      'bday setupchannel',
      'birthdays setupchannel',
      'bday setup',
      'birthdays setup',
    ],
    description: 'Set a channel for wishing your birthdays 🎂',
  })
  async setchannel(command: SimpleCommandMessage) {
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

if (!checkingBirthdays) {
  checkingBirthdays = true;
  const checkBirthdays = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateNow = `${day} - ${month}`;
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

    const convertedDay = suffixes(day);
    // @ts-ignore
    const convertedMonth = months[month];
    const birthdayString = `${convertedDay} of ${convertedMonth}`;

    const results = await Schema.find({ Birthday: birthdayString });

    if (results) {
      for (const result of results) {
        if (result.Date == dateNow) continue;

        result.Date = dateNow;
        result.save();
        const { Guild, User } = result;

        const finalGuild = await bot.guilds.cache.get(Guild!);
        if (finalGuild) {
          const data = await BirthdayChannels.findOne({
            Guild: finalGuild.id,
          });

          if (data) {
            const channel = finalGuild.channels.cache.get(data.Channel!) as unknown as undefined | TextChannel;

            if (channel)
              bot.extras.embed(
                {
                  title: `${bot.config.emotes.normal.birthday} Birthday`,
                  desc: `Happy birthday to <@!<@${User!}>>!`,
                  type: '',
                },
                channel,
              );
          }
        }
      }
    }

    setTimeout(checkBirthdays, 1000 * 10);
  };

  checkBirthdays();
}
