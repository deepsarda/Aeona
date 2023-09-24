import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup } from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import { CommandInteraction } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import schema from '../../database/models/guessNumber.js';
import { AeonaBot } from '../../utils/types.js';

import { bot } from '../../bot.js';

@Discord()
@Bot(...getPluginsBot('guess-the-number'))
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
export class GuessTheNumber {
  @SimpleCommand({
    name: 'setup guess-the-number',
    description: 'Set a channel for guess-the-number 🔢',
  })
  async gtnMessage(command: SimpleCommandMessage) {
    createSetupWizard(
      command,
      'Guess The Number',
      {
        createCallback(channel) {
          bot.extras.embed(
            {
              title: `🔢 Guess the number`,
              desc: `Guess the number between **1** and **10.000**!`,
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
    name: 'guess-the-number',
    description: 'Set a channel for guess the number minigame',
  })
  async gtnSlash(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Count',
      {
        createCallback(channel) {
          bot.extras.embed(
            {
              title: `🔢 Guess the number`,
              desc: `Guess the number between **1** and **10.000**!`,
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

    const data = await client.extras.getChannel(schema, message.guildId!, message.channel.id);
    if (!data) return;

    const number = parseInt(data.Number);
    const userNumber = parseInt(message.content);
    if (!userNumber || isNaN(userNumber)) return;

    if (userNumber == number) {
      message.react(bot.config.emotes.normal.check).catch();
      const number = Math.ceil(Math.random() * 10000);

      client.extras.sendEmbedMessage(
        {
          title: `Guess the number`,
          desc: `The number is guessed!!`,
          fields: [
            {
              name: `<:members:1063116392762712116> Guessed by`,
              value: `<@${message.author.id}> (${`${message.author.username}#${message.author.discriminator}`})`,
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
      return message.reply({
        content: 'Oh no! You guessed too high!',
      });
    } else if (userNumber < number) {
      return message.reply({
        content: 'Oh no! You guessed too low!',
      });
    }
  }
}
