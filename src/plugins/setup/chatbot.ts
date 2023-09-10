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
import { ButtonInteraction, Channel, Collection, CommandInteraction, GuildChannel, Message } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import chatbotChannel from '../../database/models/chatbot-channel.js';
import { AeonaBot } from '../../utils/types.js';

import { Components } from '../../utils/components.js';
import { bot } from '../../bot.js';
import Topgg from '@top-gg/sdk';
const api = new Topgg.Api(process.env.TOPGG_TOKEN!);

import filter from 'leo-profanity';
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
  private readonly usersMap = new Map();
  private readonly LIMIT = 4;
  private readonly TIME = 5 * 60 * 1000;
  private readonly DIFF = 60000 * 2;
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
    if (message.author.bot || message.author.id === client.user!.id) return;

    const data = await ChatbotShema.findOne({ Guild: message.guildId, Channel: message.channel.id });
    if (!data) return;

    let guild = await GuildDB.findOne({
      Guild: message.guildId,
    });
    if (!guild) guild = new GuildDB({ Guild: message.guildId });

    if (
      this.usersMap.has(message.author.id) &&
      guild.isPremium !== 'true' &&
      !(await api.hasVoted(message.author.id))
    ) {
      const userData = this.usersMap.get(message.author.id);
      const { lastMessage, timer } = userData;
      const difference = message.createdTimestamp - lastMessage.createdTimestamp;
      let { msgCount } = userData;
      ++msgCount;

      if (difference > this.DIFF) {
        clearTimeout(timer);
        userData.msgCount = 1;
        userData.lastMessage = message;
        userData.timer = setTimeout(() => {
          this.usersMap.delete(message.author.id);
        }, this.TIME);
        this.usersMap.set(message.author.id, userData);
      } else {
        if (msgCount === this.LIMIT) {
          message.delete();
          userData.msgCount = msgCount;
          this.usersMap.set(message.author.id, userData);
          return message.channel.send({
            content:
              'Hey <@' +
              message.author.id +
              '>! Sorry I have had to rate limit you for **30** seconds. \n\n You can bypass this rate limit by either upvoting me at https://top.gg/bot/' +
              client.user!.id +
              "/vote  or buying premium for your server! \n\n Q: Why this change? \n A: Alas, as we host our AI's ourself, we can't at times handle the demand due to automated bots.",
          });
        } else {
          userData.msgCount = msgCount;
          this.usersMap.set(message.author.id, userData);
        }
      }
    } else {
      const fn = setTimeout(() => {
        this.usersMap.delete(message.author.id);
      }, this.TIME);
      this.usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn,
      });
    }

    let contexts: { content: string; name: string; type: string }[] = [];
    let msgs: Collection<string, Message> = new Collection();
    if (message.channel.messages.cache.size < 10) {
      msgs = (await message.channel.messages.fetch({ limit: 10 })).sort(
        (a, b) => b.createdTimestamp - a.createdTimestamp,
      );
    } else {
      msgs = message.channel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    }
    try {
      msgs.forEach((msg) => {
        msg = bot.extras.replaceMentions(msg);
        if (msg.content && msg.content.length > 0 && contexts.length < 10)
          contexts.push({
            content: msg.content,
            name: msg.author.username,
            type: msg.author.id != bot.user?.id ? 'user' : 'bot',
          });
      });
    } catch (e) {
      //ignore error
    }

    const url = `http://localhost:8083/chatbot`;

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contexts),
    };
    message.channel.sendTyping();
    fetch(url, options)
      .then((res) => res.text())
      .then(async (json) => {
        let s = [
          '\n\n\n **Check Out: Story Generation** \n `/story generate prompt:<your story idea>` \n\n || discord.gg/W8hssA32C9 for more info ||',
        ];

        console.log(`BOT`.blue.bold, `>>`.white, `Chatbot Used`.red);

        const randomNumber = Math.floor(Math.random() * 30);
        json = randomNumber == 0 ? (json ?? '') + s[0] : json;
        let component: any[] = [];
        if (guild!.chatbotFilter) {
          if (filter.check(json)) {
            const c = new Components();
            c.addButton('Why $$$$?', 'Secondary', 'profane');
            component = c;
            json = filter.clean(json);
          }
        }

        message.reply({
          content: json.replace('@{{user}}', `${message.author}`),
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
