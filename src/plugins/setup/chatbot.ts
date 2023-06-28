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
import ChatbotShema from '../../database/models/chatbot-channel.js';
import GuildDB from '../../database/models/guild.js';
import { ButtonInteraction, Channel, CommandInteraction, GuildChannel } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import chatbotChannel from '../../database/models/chatbot-channel.js';
import { AeonaBot } from '../../utils/types.js';

import filter from 'leo-profanity';
import { Components } from '../../utils/components.js';
import { bot } from '../../bot.js';
filter.loadDictionary('en');

@Discord()
@Bot(...getPluginsBot('chatbot'))
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
export class Chatbot {
  @SimpleCommand({
    name: 'setup chatbot',
    description: 'Set a channel for talking with me 💬',
  })
  async chatbotMessage(command: SimpleCommandMessage) {
    createSetupWizard(
      command,
      'Chatbot',
      {
        createCallback() {},
        options: [],
      },
      chatbotChannel,
    );
  }

  @Slash({
    name: 'chatbot',
    description: 'Set a channel for talking with me 💬',
  })
  async chatbotSlash(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Chatbot',
      {
        createCallback() {},
        options: [],
      },
      chatbotChannel,
    );
  }

  @SimpleCommand({
    name: 'setup chatbotprofane',
    description: 'Toggle the chatbot ability to use swear words 🔥',
  })
  async chatbotProfane(command: SimpleCommandMessage) {
    let guild = await GuildDB.findOne({ Guild: command.message.guildId });
    if (!guild)
      guild = new GuildDB({
        Guild: command.message.guildId,
      });

    if (!(guild.isPremium === 'true')) {
      bot.extras.errNormal(
        {
          error: 'This guild is not a premium. \n You can buy it for just $1 [here](https://patreon.com/aeonicdiscord)',
        },
        command,
      );
    }

    let state = guild.chatbotFilter;
    state = !state;
    guild.chatbotFilter = state;
    await guild.save();
    bot.extras.succNormal(
      {
        text: `Succesfully set the chatbot filter to \`${state}\``,
      },
      command,
    );
  }

  @Slash({
    name: 'chatbotprofane',
    description: 'Toggle the chatbot ability to use swear words 🔥',
  })
  async chatbotProfaneSlash(command: CommandInteraction) {
    let guild = await GuildDB.findOne({ Guild: command.guildId });
    if (!guild)
      guild = new GuildDB({
        Guild: command.guildId,
      });
    let state = guild.chatbotFilter;
    state = !state;
    guild.chatbotFilter = state;
    await guild.save();
    bot.extras.succNormal(
      {
        text: `Succesfully set the chatbot filter to \`${state}\``,
      },
      command,
    );
  }

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (message.author.bot) return;

    const data = await ChatbotShema.findOne({ Guild: message.guildId, Channel: message.channel.id });
    if (!data) return;

    const msgs = (await message.channel.messages.fetch({ limit: 11 })).sort(
      (a, b) => b.createdTimestamp - a.createdTimestamp,
    );

    let context;
    let contexts: string[] = [];
    try {
      for (let i = 1; i <= 10; i++) {
        contexts.push(msgs.at(i)!.content);
      }
      [context, ...contexts] = contexts;
    } catch (e) {
      //ignore error
    }

    const url = `http://localhost:8083/chatbot?text=${encodeURIComponent(message.content)}&userId=${
      message.author.id
    }&key=${process.env.apiKey}${context ? `&context=${context}` : ''}${contexts
      .map((c, i) => (c ? `&context${i + 1}=${c}` : ''))
      .join('')}`;

    const options = {
      method: 'GET',
    };

    fetch(url, options)
      .then((res) => res.text())
      .then(async (json) => {
        let s = [
          '\n discord.gg/W8hssA32C9',
          'Help us grow by upvoting me at https://top.gg/bot/' + client.user!.id + '/bot',
        ];

        console.log(`BOT`.blue.bold, `>>`.white, `Chatbot Used`.red);
        let guild = await GuildDB.findOne({
          Guild: message.guildId,
        });
        if (!guild) guild = new GuildDB({ Guild: message.guildId });
        const randomNumber = Math.floor(Math.random() * 30);
        json = randomNumber == 0 ? (json ?? '') + s[0] : randomNumber == 1 ? (json ?? '') + s[1] : json;
        let component: any[] = [];
        if (guild.chatbotFilter) {
          if (filter.check(json)) {
            const c = new Components();
            c.addButton('Why $$$$?', 'Secondary', 'profane');
            component = c;
            json = filter.clean(json);
          }
        }

        message.reply({
          content: json,
          components: component,
        });
      });
  }

  @ButtonComponent({
    id: 'profane',
  })
  profaneButton(interaction: ButtonInteraction) {
    interaction.reply({
      content: `Hi there. It seems that I have quite a potty mouth. \n Premium servers can disable this using \`+setup chatbotprofane\`. \n You can get premium for just $1 [here](https://patreon.com/aeonicdiscord)`,
      flags: 1 << 6,
    });
  }
}
