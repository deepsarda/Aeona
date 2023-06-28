import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup } from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import { CommandInteraction } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import schema from '../../database/models/guessWord.js';
import { AeonaBot } from '../../utils/types.js';

import { bot } from '../../bot.js';

@Discord()
@Bot(...getPluginsBot('guess-the-word'))
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
export class GuessTheWord {
  @SimpleCommand({
    name: 'setup guess-the-word',
    description: 'Set a channel for guess-the-word 🔢',
  })
  async gtwMessage(command: SimpleCommandMessage) {
    createSetupWizard(
      command,
      'Guess The Word',
      {
        createCallback(channel) {
          const word = 'start';
          const shuffled = word
            .split('')
            .sort(function () {
              return 0.5 - Math.random();
            })
            .join('');

          bot.extras.embed(
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
            channel!,
          );
        },
        options: [],
      },
      schema,
    );
  }

  @Slash({
    name: 'guess-the-word',
    description: 'Set a channel for guess the word minigame',
  })
  async gtwSlash(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Count',
      {
        createCallback(channel) {
          const word = 'start';
          const shuffled = word
            .split('')
            .sort(function () {
              return 0.5 - Math.random();
            })
            .join('');

          bot.extras.embed(
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
            channel!,
          );
        },
        options: [],
      },
      schema,
    );
  }

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (message.author.bot) return;

    const data = await schema.findOne({ Guild: message.guildId, Channel: message.channel.id });
    if (!data) return;

    if (message.content.toLowerCase() == data.Word.toLowerCase()) {
      message.react(bot.config.emotes.normal.check);
      const word = client.extras.wordlist[Math.floor(Math.random() * client.extras.wordlist.length)];
      const shuffled = word
        .split('')
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join('');
      client.extras.sendEmbedMessage(
        {
          title: `Guess the word`,
          desc: `The word is guessed.`,
          fields: [
            {
              name: `<:members:1063116392762712116> Guessed by`,
              value: `<@${message.author.id}> (${`${message.author.username}#${message.author.discriminator}`})`,
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
    message.react(bot.config.emotes.normal.error);
  }
}
