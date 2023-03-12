import {
  createProxyCache,
  enableAmethystPlugin,
  AmethystCollection
} from '@thereallonewolf/amethystframework';
import colors from 'colors';
import { createBot, Intents } from 'discordeno';
import { createClient } from 'redis';
import JSONBigInt from 'json-bigint';
import { connect } from './database/connect.js';
import chatBotSchema from './database/models/chatbot-channel.js';
import GuildDB from './database/models/guild.js';
import { additionalProps, AeonaBot } from './extras/index.js';
import { getEnviroments } from './utils/getEnviroments.js';
import { createIpcConnections } from './utils/ipcConnections.js';
import loadFiles from './utils/loadFiles.js';
import { setupLogging } from './utils/logger.js';
import setupCategories from './utils/setupCategories.js';
import setupInhibitors from './utils/setupInhibitors.js';

const { DISCORD_TOKEN, REST_AUTHORIZATION } = getEnviroments([
  'DISCORD_TOKEN',
  'REST_AUTHORIZATION',
]);

const db = createClient();
const JSON = JSONBigInt({ useNativeBigInt: true });

db.on('error', (err) => console.log('Redis Client Error', err));

await db.connect();

const b = createBot({
  token: DISCORD_TOKEN,
  intents:
    Intents.DirectMessageReactions |
    Intents.DirectMessageTyping |
    Intents.DirectMessages |
    Intents.Guilds |
    Intents.MessageContent |
    Intents.GuildMembers |
    Intents.GuildBans |
    Intents.GuildEmojis |
    Intents.GuildIntegrations |
    Intents.GuildWebhooks |
    Intents.GuildInvites |
    Intents.GuildVoiceStates |
    Intents.GuildMessages |
    Intents.GuildMessageReactions |
    Intents.DirectMessageTyping |
    Intents.GuildScheduledEvents,
});
const cachebot = createProxyCache(b, {
  cacheInMemory: {
    default: false,
    messages: true,
  },
  cacheOutsideMemory: {
    default: true,
    messages: false,
  },

  fetchIfMissing: {
    channels: true,
    guilds: true,
    members: true,
    messages: true,
    users: true,
    roles: true,
  },

  getItem: async (table, id, guildid?) => {
    try {
      let item;
      if (table == 'channel') item = await db.get(`/channel/${id}`);
      if (table == 'guild') item = await db.get(`/guild/${id}`);
      if (table == 'user') item = await db.get(`/user/${id}`);
      if (table == 'message') item = await db.get(`/message/${id}`);
      if (table == 'member') item = await db.get(`/member/${guildid}/${id}`);
      if (table == 'role') item = await db.get(`/role/${guildid}/${id}`);
      if (item) item = JSON.parse(item);
      if (item && table == "guild") {
        try {
          item.roles = new AmethystCollection(item.roles);
          console.log(item.roles);
          item.channels = new AmethystCollection(item.channels);
        } catch (e) {
          console.error(e)
        }
      }
      return item ? item : undefined;
    } catch (e) {
      return undefined;
    }
  },

  removeItem: async (table, id, guildid?) => {
    if (table == 'channel') await db.del(`/channel/${id}`);
    if (table == 'guild') await db.del(`/guild/${id}`);
    if (table == 'user') await db.del(`/user/${id}`);
    if (table == 'message') await db.del(`/message/${id}`);
    if (table == 'member') await db.del(`/member/${guildid}/${id}`);
    if (table == 'role') await db.del(`/role/${guildid}/${id}`);

    return undefined;
  },

  setItem: async (table, item) => {
    const t = JSON.stringify(item);
    if (table == 'channel') item = await db.set(`/channel/${item.id}`, t);
    if (table == 'guild') item = await db.set(`/guild/${item.id}`, t);
    if (table == 'user') item = await db.set(`/user/${item.id}`, t);
    if (table == 'message') item = await db.set(`/message/${item.id}`, t);
    if (table == 'member')
      item = await db.set(`/member/${item.guildId}/${item.id}`, t);
    if (table == 'role')
      item = await db.set(`/role/${item.guildId}/${item.id}`, t);

    return item;
  },
});

const bot: AeonaBot = enableAmethystPlugin(cachebot, {
  owners: ['794921502230577182', '830231116660604951'],
  prefix: async (bot, message) => {
    if (process.env.DEV === 'true' && message.channelId != 1073654475652333568n)
      return 'asdasdasdasdasdasdasdasdasdq3w12341234';

    const schema = await chatBotSchema.findOne({
      Guild: `${message.guildId}`,
      Channel: `${message.channelId}`,
    });
    if (schema) return 'asdasdasdasdasdasdasdasdasdq3w12341234';

    let guild = await GuildDB.findOne({
      Guild: message.guildId,
    });
    if (!guild) guild = new GuildDB({ Guild: message.guildId });

    if (!guild.Prefix) {
      guild.Prefix = process.env.BOTPREFIX!;
      guild.save();
    }
    if (message.mentionedUserIds.includes(bot.applicationId)) {
      return [
        guild.Prefix,
        'aeona',
        `<@!${bot.user?.id}>`,
        `<@${bot.user?.id}>`,
        '',
      ];
    }
    return [guild.Prefix, 'aeona', `<@!${bot.user?.id}>`, `<@${bot.user?.id}>`];
  },
  botMentionAsPrefix: true,
  ignoreBots: true,
});
connect();
setupLogging(bot);
bot.extras = additionalProps(bot);
await loadFiles(bot);
setupInhibitors(bot);
setupCategories(bot);

createIpcConnections(bot, DISCORD_TOKEN, REST_AUTHORIZATION);

console.log(colors.green('STARTING'));

async function logDbCache() {
  console.log("Getting Cache Length...".yellow);
  console.table([{
    type: "channel",
    count: (await db.KEYS("/channel/*")).length
  }, {
    type: "guild",
    count: (await db.KEYS("/guild/*")).length
  }, {
    type: "user",
    count: (await db.KEYS("/user/*")).length
  }, {
    type: "member",
    count: (await db.KEYS("/member/*")).length
  }, {
    type: "roles",
    count: (await db.KEYS("/role/*")).length
  }]);
}

setInterval(() => {
  console.log("Getting Cache Length...".yellow);
  logDbCache();
}, 60 * 1000 * 10);

logDbCache();

export { bot };


process.on('unhandledRejection', (error: Error) => {
  console.error(error);
});

process.on('warning', (warn) => {
  console.warn(warn);
});

//@ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};
