import { Message } from 'discordeno';

import Schema from '../../database/models/guessWord.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot) => {
  client.on('messageCreateNoBots', async (bot: AeonaBot, message: Message) => {
    if (!message.guildId) return;
    const wordList = client.extras.config.wordList.split('\n');

    const data = await Schema.findOne({
      Guild: message.guildId,
      Channel: message.channelId,
    });

    if (data) {
      if (message.content.toLowerCase() == data.Word.toLowerCase()) {
        bot.helpers.addReaction(
          message.channelId,
          `${message.id}`,
          client.extras.emotes.normal.check,
        );
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const shuffled = word
          .split('')
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join('');
        const user = await client.helpers.getUser(message.authorId);
        client.extras.sendEmbedMessage(
          {
            title: `Guess the word`,
            desc: `The word is guessed.`,
            fields: [
              {
                name: `<:members:1063116392762712116> Guessed by`,
                value: `<@${user.id}> (${`${user.username}#${user.discriminator}`})`,
                inline: true,
              },
              {
                name: `💬 Correct word`,
                value: `${data.Word}`,
                inline: true,
              },
            ],
          },
          message,
        );

        data.Word = word;
        data.save();

        return client.extras.sendEmbedMessage(
          {
            title: `Guess the word`,
            desc: `Put the letters in the right position!`,
            fields: [
              {
                name: `💬 Word`,
                value: `${shuffled.toLowerCase()}`,
              },
            ],
          },
          message,
        );
      }
      return bot.helpers.addReaction(
        message.channelId,
        `${message.id}`,
        client.extras.emotes.normal.error,
      );
    }
  });
};
