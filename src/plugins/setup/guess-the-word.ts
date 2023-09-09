import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import {
  ArgsOf,
  Bot,
  ButtonComponent,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandMessage,
  Slash,
  SlashGroup,
} from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import schema from '../../database/models/guessWord.js';
import { AeonaBot } from '../../utils/types.js';

import { bot } from '../../bot.js';
import { Components } from '../../utils/components.js';

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
  components = new Components().addButton('Skip', 'Secondary', 'skipWord');

  @SimpleCommand({
    name: 'setup guess-the-word',
    description: 'Set a channel for guess-the-word 🔢',
  })
  async gtwMessage(command: SimpleCommandMessage) {
    let components = this.components;
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
              components,
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
    const components = this.components;
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
              components,
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

    if (message.content.toLowerCase().trim() == data.word.toLowerCase().trim() || data.word == 'start') {
      message.react(bot.config.emotes.normal.check).catch();
      const word = client.extras.wordlist[Math.floor(Math.random() * client.extras.wordlist.length)].trim();
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
              value: `${data.word}`,
              inline: true,
            },
          ],
        },
        message,
      );

      data.word = word;
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
          components: this.components,
        },
        message,
      );
    }
    message.react(bot.config.emotes.normal.error).catch();
  }
  @Guard(PermissionGuard([]))
  @ButtonComponent({
    id: 'skipWord',
  })
  async skipWord(interaction: ButtonInteraction) {
    interaction.deferUpdate();

    const data = await schema.findOne({ Guild: interaction.guildId, Channel: interaction.channelId });
    if (!data) return;

    const word = bot.extras.wordlist[Math.floor(Math.random() * bot.extras.wordlist.length)].trim();
    const shuffled = word
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');

    bot.extras.sendEmbedMessage(
      {
        title: `Guess the word`,
        desc: `The word is skipped.`,
        fields: [
          {
            name: `💬 Correct Word`,
            value: `${data.word}`,
            inline: true,
          },
          {
            name: `💬 New word`,
            value: `${shuffled}`,
            inline: true,
          },
        ],
        components: this.components,
      },
      interaction.message,
    );

    data.word = word;
    data.save();
  }
}
