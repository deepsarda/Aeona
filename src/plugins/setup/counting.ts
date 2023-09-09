import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup } from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import { CommandInteraction, Message, TextChannel } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import schema from '../../database/models/countChannel.js';
import { AeonaBot } from '../../utils/types.js';
import count from '../../database/models/count.js';
import { bot } from '../../bot.js';

@Discord()
@Bot(...getPluginsBot('counting'))
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
export class Counting {
  @SimpleCommand({
    name: 'setup counting',
    description: 'Set a channel for counting 🔢',
  })
  async countingMessage(command: SimpleCommandMessage) {
    createSetupWizard(
      command,
      'Count',
      {
        createCallback(channel) {
          bot.extras.embed(
            {
              title: `🔢 Counting`,
              desc: `This is the start of counting! The first number is **1**`,
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
    name: 'counting',
    description: 'Set a channel for counting minigame with me 🔢',
  })
  async countingSlah(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Count',
      {
        createCallback(channel) {
          bot.extras.embed(
            {
              title: `🔢 Counting`,
              desc: `This is the start of counting! The first number is **1**`,
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
    const countData = await count.findOne({ Guild: message.guildId });

    if (data && countData) {
      if (!Number(message.content) || Number.isNaN(Number(message.content))) return;
      client.emit('logFeatureUse', client, 'counting');
      if (`${message.author.id}` == countData.User!) {
        try {
          client.extras.errNormal(
            {
              error: 'You cannot count twice in a row',
              type: 'reply',
            },
            message.channel as unknown as TextChannel,
          );

          return message.react(bot.config.emotes.normal.error).catch();
        } catch (error) {
          message.react(bot.config.emotes.normal.error).catch();
          throw error;
        }
      } else if (Number(message.content) == countData.Count) {
        message.react(bot.config.emotes.normal.check).catch();
        countData.User = `${message.author.id}`;
        countData.Count += 1;
        countData.save();
      } else {
        try {
          client.extras.errNormal(
            {
              error: `The correct number was ${countData.Count}!`,
              type: 'reply',
            },
            message.channel as unknown as TextChannel,
          );

          return message.react(bot.config.emotes.normal.error).catch();
        } catch (error) {
          message.react(bot.config.emotes.normal.error).catch();
          throw error;
        }
      }
    } else if (data) {
      if (Number(message.content) == (countData?.Count ?? 0) + 1) {
        message.react(bot.config.emotes.normal.check).catch();
        new count({
          Guild: message.guildId,
          User: message.author.id,
          Count: (countData?.Count ?? 0) + 1,
        }).save();
      } else {
        return message.react(bot.config.emotes.normal.error).catch();
      }
    }
  }

  @On()
  async messageDelete([message]: ArgsOf<'messageDelete'>, client: AeonaBot) {
    if (message.author?.bot) return;
    try {
      const data = await schema.findOne({
        Guild: message.guildId,
        Channel: message.channelId,
      });
      const countData = await count.findOne({ Guild: message.guildId });

      if (data && countData) {
        const lastCount = countData.Count! - 1;
        if (Number(message.content) == lastCount) {
          client.extras.simpleMessageEmbed(
            {
              title: ``,
              desc: `**User**: ${message.content}`,
            },
            message as unknown as Message,
          );
        }
      }
    } catch {
      //
    }
  }
}
