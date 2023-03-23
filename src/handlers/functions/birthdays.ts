import Bdays from '../../database/models/bdays.js';
import Schema from '../../database/models/birthday.js';
import birthdayChannel from '../../database/models/birthdaychannels.js';
import { AeonaBot } from '../../extras/index.js';

export default (client: AeonaBot) => {
  const checkBirthdays = async () => {
    const now = new Date();
    const getLastDate = await Bdays.findOne({ Action: 'Birthday' }).exec();

    const month = now.getMonth() + 1;
    const day = now.getDate();

    const dateNow = `${day} - ${month}`;

    if (getLastDate) {
      const lastDate = getLastDate.Date;

      if (lastDate == dateNow) return;

      getLastDate.Date = dateNow;
      getLastDate.save();
    } else {
      new Bdays({
        Action: 'Birthday',
        Date: dateNow,
      }).save();
    }

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
        const { Guild, User } = result;

        const finalGuild = await client.cache.guilds.get(BigInt(Guild!));
        if (finalGuild) {
          birthdayChannel.findOne({ Guild: finalGuild.id }, async (err: any, data: any) => {
            if (data) {
              const channel = finalGuild.channels.get(data.Channel);

              client.extras.embed(
                {
                  title: `${client.extras.emotes.normal.birthday} Birthday`,
                  desc: `Happy birthday to <@!<@${User!}>>!`,
                  type: '',
                },
                channel!,
              );
            }
          });
        }
      }
    }

    setTimeout(checkBirthdays, 1000 * 10);
  };

  checkBirthdays();
};

function suffixes(number: any) {
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
