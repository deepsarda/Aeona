import { Message } from 'discordeno';

import Schema from '../../database/models/guessNumber.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot) => {
  client.on('messageCreateNoBots', async (bot: AeonaBot, message: Message) => {
    if (!message.guildId) return;
    const data = await Schema.findOne({
      Guild: message.guildId,
      Channel: message.channelId,
    });
    if (data) {
      const number = parseInt(data.Number);
      const userNumber = parseInt(message.content);
      if (!userNumber || isNaN(userNumber)) return;

      if (userNumber == number) {
        bot.helpers.addReaction(
          message.channelId,
          `${message.id}`,
          client.extras.emotes.normal.check,
        );
        const number = Math.ceil(Math.random() * 10000);
        const user = await client.helpers.getUser(message.authorId);
        client.extras.sendEmbedMessage(
          {
            title: `Guess the number`,
            desc: `The number is guessed!!`,
            fields: [
              {
                name: `<:members:1063116392762712116> Guessed by`,
                value: `<@${user.id}> (${`${user.username}#${user.discriminator}`})`,
                inline: true,
              },
              {
                name: `🔢 Correct number`,
                value: `${data.Number}`,
                inline: true,
              },
            ],
          },
          message,
        );

        data.Number = `${number}`;
        data.save();

        client.extras.sendEmbedMessage(
          {
            title: `🔢 Guess the number`,
            desc: `Guess the number between **1** and **10.000**!`,
          },
          message,
        );
      } else if (userNumber > number) {
        return client.helpers.sendMessage(message.channelId, {
          content: 'Oh no! You guessed too high!',
        });
      } else if (userNumber < number) {
        return client.helpers.sendMessage(message.channelId, {
          content: 'Oh no! You guessed too low!',
        });
      }
    }
  });
};
