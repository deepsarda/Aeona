import {
  createProxyCache,
  enableAmethystPlugin,
} from '@thereallonewolf/amethystframework';
import colors from 'colors';
import { createBot, Intents } from 'discordeno';
import JSON from 'json-bigint';
import { Config, JsonDB } from 'node-json-db';

import { connect } from './database/connect.js';
import chatBotSchema from './database/models/chatbot-channel.js';
import Functions from './database/models/functions.js';
import { additionalProps, AeonaBot } from './extras/index.js';
import { getEnviroments } from './utils/getEnviroments.js';
import { createIpcConnections } from './utils/ipcConnections.js';
import loadFiles from './utils/loadFiles.js';
import { setupLogging } from './utils/logger.js';
import setupCategories from './utils/setupCategories.js';
import setupInhibitors from './utils/setupInhibitors.js';
import setupMusic from './utils/setupMusic.js';

const { DISCORD_TOKEN, REST_AUTHORIZATION } = getEnviroments([
  'DISCORD_TOKEN',
  'REST_AUTHORIZATION',
]);

const db = new JsonDB(new Config('tmp/db', true, false, '/'));
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
    channels: true,
    members: true,
    roles: false,
  },
  cacheOutsideMemory: {
    default: false,
    members: false,
    messages: false,
  },
  //@ts-ignore
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
      'roles',
      'channels',
    ],
  },
  getItem: async (table, id, guildid?) => {
    const item = await db.getData(`${id}${guildid || ''}`);
    if (!item) return;
    return JSON.parse(item);
  },

  removeItem: async (table, id, guildid?) => {
    // eslint-disable-next-line no-return-await
    return await db.delete(`${id}${guildid || ''}`);
  },

  setItem: async (table, item) => {
    const i = await db.push(
      `${item.id}${item.guildid ? item.guildid : ''}`,
      JSON.stringify(item),
    );
    db.save();
    return i;
  },
});
db.reload();

const bot: AeonaBot = enableAmethystPlugin(cachebot, {
  owners: ['794921502230577182', '830231116660604951'],
  prefix: async (bot, message) => {
    const schema = await chatBotSchema.findOne({ Guild: message.guildId });
    if (schema)
      if (schema.Channel == `${message.channelId}`)
        return 'asdasdasdasdasdasdasdasdasdq3w12341234';

    let guild = await Functions.findOne({
      Guild: message.guildId,
    });
    if (!guild) guild = new Functions({ Guild: message.guildId });

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

setupLogging(bot);
bot.extras = additionalProps(bot);
await loadFiles(bot);
setupMusic(bot);
setupInhibitors(bot);
setupCategories(bot);

createIpcConnections(bot, DISCORD_TOKEN, REST_AUTHORIZATION);
connect();

console.log(colors.green('STARTING'));

export { bot };

process.on('unhandledRejection', (error: Error) => {
  console.error(error);
});

process.on('warning', (warn) => {
  console.warn(warn);
});
