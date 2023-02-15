import {
  createProxyCache,
  enableAmethystPlugin,
} from '@thereallonewolf/amethystframework';
import colors from 'colors';
import { createBot, Intents } from 'discordeno';
import { Config, JsonDB } from 'node-json-db';

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

const db = new JsonDB(new Config('tmp/db', false, false, '/'));
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
    default: true,
    channels: false,
    members: false,
    roles: false,
  },
  cacheOutsideMemory: {
    default: false,
    members: true,
    messages: false,
    channels: true,
  },

  fetchIfMissing: {
    channels: true,
    guilds: true,
    members: true,
    messages: true,
    users: true,
    roles: true,
  },
  undesiredProps: {
    guilds: [
      'afkChannelId',
      'afkTimeout',
      'approximatePresenceCount',
      'emojis',
      'widgetChannelId',
      'description',
      'discoverySplash',
      'welcomeScreen',
      'permissions',
      'rulesChannelId',
      'systemChannelFlags',
      'stageInstances',
      'toggles',
    ],
  },
  getItem: async (table, id, guildid?) => {
    try {
      let item;
      if (table == 'channel') item = await db.getObject(`/channel/${id}`);
      if (table == 'guild') item = await db.getObject(`/guild/${id}`);
      if (table == 'user') item = await db.getObject(`/user/${id}`);
      if (table == 'message') item = await db.getObject(`/message/${id}`);
      if (table == 'member')
        item = await db.getObject(`/member/${guildid}/${id}`);
      if (table == 'role') item = await db.getObject(`/role/${guildid}/${id}`);

      return item;
    } catch (e) {
      return undefined;
    }
  },

  removeItem: async (table, id, guildid?) => {
    let item;
    if (table == 'channel') item = await db.delete(`/channel/${id}`);
    if (table == 'guild') item = await db.delete(`/guild/${id}`);
    if (table == 'user') item = await db.delete(`/user/${id}`);
    if (table == 'message') item = await db.delete(`/message/${id}`);
    if (table == 'member') item = await db.delete(`/member/${guildid}/${id}`);
    if (table == 'role') item = await db.delete(`/role/${guildid}/${id}`);

    return item;
  },

  setItem: async (table, item) => {
    if (table == 'channel') item = await db.push(`/channel/${item.id}`, item);
    if (table == 'guild') item = await db.push(`/guild/${item.id}`, item);
    if (table == 'user') item = await db.push(`/user/${item.id}`, item);
    if (table == 'message') item = await db.push(`/message/${item.id}`, item);
    if (table == 'member')
      item = await db.push(`/member/${item.guildId}/${item.id}`, item);
    if (table == 'role')
      item = await db.push(`/role/${item.guildId}/${item.idid}`, item);

    return item;
  },
});
db.reload();
setInterval(() => {
  db.save();
}, 60000);
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
