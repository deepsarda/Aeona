import { dirname, importx } from '@discordx/importer';
import type { Interaction, Message } from 'discord.js';
import {
  Collection,
  CommandInteraction,
  IntentsBitField,
  InteractionResponse,
  InteractionResponseType,
  MessagePayload,
  Routes,
} from 'discord.js';
import permissions from './utils/permissions.js';
import { Client, MetadataStorage } from 'discordx';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { AeonaBot } from './utils/types.js';
import { connect } from './database/connect.js';
import chatBotSchema from './database/models/chatbot-channel.js';
import GuildDB from './database/models/guild.js';
import { getConfig } from './utils/config.js';
import colors from 'colors';
import dotenv from 'dotenv';
import { additionalProps } from './utils/extras.js';
dotenv.config();
permissions();
const config = getConfig(process.env.DISCORD_TOKEN!)!;

//@ts-expect-error
export const bot: AeonaBot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildScheduledEvents,
  ],
  silent: true,
  simpleCommand: {
    prefix: async (message) => {
      if (process.env.DEV === 'true' && message.channelId != '1073654475652333568') return 'asd';

      const schema = await chatBotSchema.findOne({
        Guild: `${message.guildId}`,
        Channel: `${message.channelId}`,
      });
      if (schema) return 'asda';

      let guild = await GuildDB.findOne({
        Guild: message.guildId,
      });
      if (!guild) guild = new GuildDB({ Guild: message.guildId });

      if (!guild.Prefix) {
        guild.Prefix = config.prefix;
        guild.save();
      }
      if (message.mentions.users.has(bot.botId)) {
        return [guild.Prefix, bot.user?.username ?? 'aeona', `<@!${bot.botId}>`, `<@${bot.botId}>`, ''];
      }
      return [
        guild.Prefix ?? config.prefix,
        bot.user?.username ?? 'aeona',
        `<@!${bot.user?.id}>`,
        `<@${bot.user?.id}>`,
      ];
    },
    responses: {
      async notFound(message) {
        let contexts: { content: string; name: string; type: string }[] = [];
        let msgs: Collection<string, Message> = new Collection();
        if (message.channel.messages.cache.size < 10) {
          msgs = (await message.channel.messages.fetch({ limit: 20 })).sort(
            (a, b) => b.createdTimestamp - a.createdTimestamp,
          );
        } else {
          msgs = message.channel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
        }
        try {
          msgs.forEach((msg) => {
            if (msg.content && msg.content.length > 0 && contexts.length < 20)
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

            message.reply({
              content: json,
              components: component,
            });
          });
      },
    },
  },
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
  botId: config.name,
});

bot.config = config;
bot.cluster = new ClusterClient(bot);
bot.extras = additionalProps(bot);

bot.once('ready', async () => {
  await bot.initApplicationCommands();
  console.log(colors.green('Bot started'));

  async function updateTopGGStats() {
    console.log('Updating top.gg stats...');
    await fetch(`https://top.gg/api/bots/${bot.user!.id}/stats`, {
      method: 'POST',
      headers: { Authorization: process.env.TOPGG_TOKEN! },
      body: new URLSearchParams({
        server_count: `${bot.guilds.cache.size}`,
        shard_count: `${bot.cluster.info.TOTAL_SHARDS}`,
      }),
    }).then((res) => {
      res.text().then((data) => {
        console.log(data);
      });
    });
  }

  updateTopGGStats();

  setInterval(updateTopGGStats, 60 * 1000 * 10);
});

bot.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) await interaction.deferReply();
  bot.executeInteraction(interaction);
});

bot.on('messageCreate', (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,plugins}/**/*.{ts,js}`);
  MetadataStorage.instance.build().then(() => {
    bot.login(config.token);
  });
}
connect();
run();

process.on('unhandledRejection', (reason: Error) => {
  console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow);
  console.log('Reason: ', reason.stack ? String(reason.stack) : String(reason));
  console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow);
});
process.on('uncaughtException', (err) => {
  console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow);
  console.log('Exception: ', err.stack ? err.stack : err);
  console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow);
});
process.on('uncaughtExceptionMonitor', (err) => {
  console.log('=== uncaught Exception Monitor ==='.toUpperCase().yellow);
  console.log('Exception: ', err.stack ? err.stack : err);
  console.log('=== uncaught Exception Monitor ==='.toUpperCase().yellow);
});

const builtins = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

for (const printFunction in builtins) {
  //@ts-expect-error
  console[printFunction] = function () {
    // builtins[printFunction].apply(console, [...arguments]);
    try {
      const message = [...arguments]
        .reduce((accumulator, current) => `${accumulator}  ${current} `, '')
        .replace(/\s+$/, '')
        .toString()
        .split('\n');
      for (const line of message) {
        bot.cluster!.send({ log: line });
      }
    } catch (e) {
      console.error(e);
    }
  };
}
