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

import filter from 'leo-profanity';
import { channel } from 'diagnostics_channel';
filter.loadDictionary('en');
export const currentChatbotJobs: Collection<string, { userId: string; timer: NodeJS.Timeout }> = new Collection();

@Discord()
@Bot(...getPluginsBot('chatbot'))
@Category('setup')
@SlashGroup({
  name: 'setup',
  description: 'Various commands setup up my various features. 🛠️',
})
@SlashGroup('setup')
export class Chatbot {
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
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
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
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
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
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
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
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

    if (
      currentChatbotJobs.has(message.channel.id) &&
      currentChatbotJobs.get(message.channel.id)!.userId === message.author.id
    ) {
      currentChatbotJobs.get(message.channel.id)!.timer.refresh();
    } else if (currentChatbotJobs.has(message.channel.id)) {
      clearTimeout(currentChatbotJobs.get(message.channel.id)!.timer);
      currentChatbotJobs.delete(message.channel.id);
      message.channel.sendTyping();
      //wait for 3 seconds for old job to finish
      await new Promise((resolve) => setTimeout(resolve, 3000));
      currentChatbotJobs.set(message.channel.id, {
        userId: message.author.id,
        timer: setTimeout(() => currentChatbotJobs.delete(message.channel.id), 20000),
      });

      chabotJob(message, client);
    } else {
      currentChatbotJobs.set(message.channel.id, {
        userId: message.author.id,
        timer: setTimeout(() => currentChatbotJobs.delete(message.channel.id), 20000),
      });
      message.channel.sendTyping();
      chabotJob(message, client);
    }
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

export async function chabotJob(message: Message, client: AeonaBot) {
  if (message.author.bot || message.author.id === client.user!.id) return;

  while (true) {
    if (currentChatbotJobs.has(message.channel.id)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else break;
  }

  const data = await ChatbotShema.findOne({ Guild: message.guildId, Channel: message.channel.id });
  if (!data) return;

  let guild = await GuildDB.findOne({
    Guild: message.guildId,
  });
  if (!guild) guild = new GuildDB({ Guild: message.guildId });

  let contexts: { content: string; name: string; type: string }[] = [];
  let m: Collection<string, Message> = new Collection();
  let msgs: Collection<string, Message> = new Collection();
  if (message.channel.messages.cache.size < 10) {
    m = (await message.channel.messages.fetch({ limit: 30 })).sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  } else {
    m = message.channel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  }
  for (const [id, msg] of m) {
    let lastMessage = msgs.last();

    if (
      lastMessage &&
      lastMessage.author.id == msg.author.id &&
      lastMessage.content &&
      lastMessage.content.length > 0
    ) {
      lastMessage.content += `\n${msg.content}`;
      msgs.set(lastMessage.id, lastMessage);
    } else {
      if (
        msg &&
        msg.content &&
        msg.content.length > 0 &&
        (msg.author.id != bot.user?.id ? msg.createdTimestamp < message.createdTimestamp : true)
      )
        msgs.set(msg.id, msg);
    }
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
      let component = new Components();
      component.addButton('Upvote', 'Link', 'https://top.gg/bot/931226824753700934/vote');
      component.addButton('Support', 'Link', 'https://discord.gg/W8hssA32C9');

      if (guild!.chatbotFilter) {
        if (filter.check(json)) {
          component.addButton('Why **** ?', 'Secondary', 'profane');
          json = filter.clean(json);
        }
      }

      message.reply({
        content: json.replace('@{{user}}', `${message.author}`),
        components: component,
      });
    });
}
