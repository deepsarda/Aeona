import {
  AmethystError,
  CategoryOptions,
  Components,
  createProxyCache,
  enableAmethystPlugin,
  ErrorEnums,
} from '@thereallonewolf/amethystframework';
import colors from 'colors';
import { createBot, Intents } from 'discordeno';
import fs from 'fs';
import JSON from 'json-bigint';
import fetch from 'node-fetch';
import { Config, JsonDB } from 'node-json-db';

import { connect } from './database/connect.js';
import chatBotSchema from './database/models/chatbot-channel.js';
import Functions from './database/models/functions.js';
import { additionalProps, AeonaBot } from './extras/index.js';
import { createIpcConnections } from './structures/ipcConnections.js';
import { getEnviroments } from './utils/getEnviroments.js';
import { logger } from './utils/logger.js';

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
    Intents.GuildMessageTyping |
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
  fetchIfMissing: {
    channels: true,
    guilds: true,
    members: true,
    messages: true,
    users: true,
    roles: true,
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
    const i = await db.push(`${item.id}${item.guildid ? item.guildid : ''}`, JSON.stringify(item));
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
      if (schema.Channel == `${message.channelId}`) return 'asdasdasdasdasdasdasdasdasdq3w12341234';

    let guild = await Functions.findOne({
      Guild: message.guildId,
    });
    if (!guild) guild = new Functions({ Guild: message.guildId });

    if (!guild.Prefix) {
      guild.Prefix = process.env.PREFIX!;
      guild.save();
    }
    if (message.mentionedUserIds.includes(bot.applicationId)) {
      return [guild.Prefix, 'aeona', `<@!${bot.user?.id}>`, `<@${bot.user?.id}>`, ''];
    }
    return [guild.Prefix, 'aeona', `<@!${bot.user?.id}>`, `<@${bot.user?.id}>`];
  },
  botMentionAsPrefix: true,
  ignoreBots: true,
});

bot.extras = additionalProps(bot);

bot.extras.player.on('nodeConnect', () => console.log('Lavalink is connected.'.green));
bot.extras.player.on('nodeError', (node, error) =>
  console.log(
    colors.red(colors.bold(`ERROR`)),
    colors.white(`>>`),
    colors.white(`Node`),
    colors.red(`${node.options.identifier}`),
    colors.white(`had an error:`),
    colors.red(`${error.message}`),
  ),
);
bot.extras.player.on('playerDisconnect', async (player, _track) => {
  player.destroy();

  const channel = await bot.helpers.getChannel(player.textChannel!);
  bot.extras.errNormal(
    {
      error: "Music has stopped. I'm disconnected from the channel",
    },
    channel,
  );
});
bot.extras.player.on('playerMove', async (player, currentChannel, newChannel) => {
  if (!newChannel) {
    player.destroy();

    const channel = await bot.helpers.getChannel(player.textChannel!);
    bot.extras.errNormal(
      {
        error: "Music has stopped. I'm disconnected from the channel",
      },
      channel,
    );
  } else {
    player.set('moved', true);
    player.setVoiceChannel(newChannel);
    if (player.paused) return;
    setTimeout(() => {
      player.pause(true);
      setTimeout(() => player.pause(false), 1000 * 2);
    }, 1000 * 2);
  }
});
bot.extras.player.on('queueEnd', async (player, _track) => {
  player.destroy(true);

  const channel = await bot.helpers.getChannel(player.textChannel!);
  bot.extras.errNormal(
    {
      error: 'Queue is empty, Leaving voice channel',
    },
    channel,
  );
});
bot.extras.player.on('trackStart', async (player, track) => {
  const components = new Components();
  components.addButton('', 'Secondary', 'musicprev', {
    emoji: '<:previous:1060474160163328000>',
  });
  components.addButton('', 'Secondary', 'musicpause', {
    emoji: '<:pause:1060473490744029184>',
  });
  components.addButton('', 'Secondary', 'musicstop', {
    emoji: '🛑',
  });
  components.addButton('', 'Secondary', 'musicnext', {
    emoji: '<:next:1060474589349683270>',
  });

  const channel = await bot.helpers.getChannel(player.textChannel!);

  bot.extras.embed(
    {
      title: `<:Pink_music:1062773191107416094> ${track.title}`,
      url: track.uri,
      desc: `Music started in <#${player.voiceChannel}>!`,
      thumbnail: track.thumbnail!,
      fields: [
        {
          name: `👤 Requested By`,
          value: `${track.requester}`,
          inline: true,
        },
        {
          name: `🕒 Ends at`,
          value: `<t:${(Date.now() / 1000 + track.duration / 1000).toFixed(0)}:f> `,
          inline: true,
        },
        {
          name: `🎬 Author`,
          value: `${track.author}`,
          inline: true,
        },
      ],
      components,
    },
    channel,
  );
});
connect();

let dirs = fs.readdirSync('./dist/handlers/');
for (let i = 0; i < dirs.length; i++) {
  const dir = dirs[i];
  const dirs1 = fs.readdirSync(`./dist/handlers/${dir}`);

  for (let j = 0; j < dirs1.length; j++) {
    const a = await import(`./handlers/${dir}/${dirs1[j]}`);

    a.default(bot);
  }
}

dirs = fs.readdirSync('./dist/events/');
for (let i = 0; i < dirs.length; i++) {
  const dir = dirs[i];
  const dirs1 = fs.readdirSync(`./dist/events/${dir}`);

  for (let j = 0; j < dirs1.length; j++) {
    const a = await import(`./events/${dir}/${dirs1[j]}`);

    bot.on(dirs1[j].split('.')[0]!, a.default);
  }
}
dirs = fs.readdirSync('./dist/commands/');
for (let i = 0; i < dirs.length; i++) {
  const dir = dirs[i];
  const dirs1 = fs.readdirSync(`./dist/commands/${dir}`);

  for (let j = 0; j < dirs1.length; j++) {
    const a = await import(`./commands/${dir}/${dirs1[j]}`);

    bot.amethystUtils.createCommand(a.default);
  }
}

const categories: CategoryOptions[] = [
  {
    name: 'afk',
    description: 'Set/List your afk.',
    uniqueCommands: false,
    default: 'set',
  },
  {
    name: 'setup',
    description: 'Configure your server. (Must See)',
    uniqueCommands: false,
    default: 'chatbot',
  },
  {
    name: 'info',
    description: 'See various informations',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'automod',
    description: 'Configure the automod.',
    uniqueCommands: false,
    default: 'display',
  },
  {
    name: 'autosetup',
    description: 'Automatically setup certain commands.',
    uniqueCommands: false,
    default: 'log',
  },
  {
    name: 'fun',
    description: 'Have some fun.',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'game',
    description: 'Play some games.',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'levels',
    description: 'Configure the rank system',
    uniqueCommands: true,
    default: 'rank',
  },
  {
    name: 'bumpreminder',
    description: 'Setup bumpreminder for your server.',
    uniqueCommands: false,
    default: 'setup',
  },
  {
    name: 'anime',
    description: 'Some anime commands',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'anime2',
    description: 'Some more anime commands',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'reactionroles',
    description: 'Setup reaction roles for your server',
    uniqueCommands: false,
    default: 'list',
  },
  {
    name: 'moderation',
    description: 'Clean your server',
    uniqueCommands: true,
    default: 'family',
  },
  {
    name: 'embed',
    description: 'Create and modify embeds.',
    uniqueCommands: true,
    default: 'setup',
  },
  {
    name: 'music',
    description: 'Listen to some music',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'serverstats',
    description: 'Configure your server stats',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'marriage',
    description: 'Create your family',
    uniqueCommands: true,
    default: 'family',
  },
  {
    name: 'image',
    description: 'Enjoy image magic',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'code',
    description: 'Some useful coding commands',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'announcement',
    description: 'Create/Edit your announcement.',
    uniqueCommands: false,
    default: 'create',
  },
  {
    name: 'birthdays',
    description: 'List your birthdays.',
    uniqueCommands: false,
    default: 'list',
  },
  {
    name: 'invites',
    description: 'Configure the invites system',
    uniqueCommands: false,
    default: 'show',
  },
  {
    name: 'messages',
    description: 'Configure the messages system',
    uniqueCommands: false,
    default: 'show',
  },
  {
    name: 'stickymessages',
    description: 'Configure sticky messages',
    uniqueCommands: false,
    default: 'messages',
  },
  {
    name: 'suggestions',
    description: 'Create/Deny/Accept suggestions',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'thanks',
    description: 'Thank users for their help',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'tickets',
    description: 'Various ticket commands',
    uniqueCommands: true,
    default: 'list',
  },
  {
    name: 'tools',
    description: 'Various commands to help you',
    uniqueCommands: true,
    default: '',
  },
  {
    name: 'owner',
    description: 'Private commands for the owners',
    uniqueCommands: true,
    default: '',
  },
];
for (let i = 0; i < categories.length; i++) {
  bot.amethystUtils.createCategory(categories[i]);
}

bot.inhibitors.set('upvoteonly', async (b, command, options): Promise<true | AmethystError> => {
  if (command.extras.upvoteOnly) {
    if (options && options.guildId) {
      let guildDB = await Functions.findOne({ Guild: `${options.guildId}` });
      if (!guildDB)
        guildDB = new Functions({
          Guild: `${options.guildId}`,
        });
      if (guildDB.isPremium === 'true') return true;
    }
    try {
      if (process.env.TOPGG_TOKEN) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(
          `https://top.gg/api/bots/${bot.user.id}/check?userId=${options?.author!.id}`,
          {
            signal: controller.signal,
            headers: {
              authorization: process.env.TOPGG_TOKEN,
            },
          },
        );
        clearTimeout(timeoutId);
        const json: any = await response.json();
        if (json.voted == 1) return true;
        return {
          // @ts-ignore
          type: ErrorEnums.OTHER,
          value:
            'You need to upvote me at https://top.gg/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at https://patreon.com/aeonadiscord __ and remove all ads.',
        };
      }
    } catch (e) {
      console.log(`Error in upvote:${e}`);
      return true;
    }

    return {
      // @ts-ignore
      type: ErrorEnums.OTHER,
      value:
        'You need to upvote me at https://top.gg/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at https://patreon.com/aeonadiscord __ and remove all ads.',
    };
  }
  return true;
});
logger.info('Creating IPC connection');
const restClient = await createIpcConnections(bot);

/*
logger.info('Setting up the custom rest manager');

const runMethod = async <T = any>(
  client: Client,
  rest: RestManager,
  method: RequestMethod,
  route: string,
  body?: unknown,
  options?: {
    retryCount?: number;
    bucketId?: string;
    headers?: Record<string, string>;
  },
): Promise<T> => {
  const response = await client.request(
    {
      type: 'RUN_METHOD',
      data: {
        Authorization: rest.secretKey,
        url: route,
        body,
        method,
        options,
      },
    },
    0,
  );

  if (response?.statusCode >= 400) logger.error(`[${response.status}] - ${response.error}`);
  return response;
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const sendRequest = async <T = any>(
  client: Client,
  rest: RestManager,
  method: RequestMethod,
  route: string,
  bucketId?: string,
  retryCount?: number,
  payload?: {
    headers: Record<string, string>;
    body: unknown;
  },
): Promise<T> => {
  const response = await client.request(
    {
      type: 'SEND_REQUEST',
      data: {
        Authorization: rest.secretKey,
        url: route,
        method,
        bucketId,
        retryCount,
        payload,
      },
    },
    0,
  );

  if (response?.statusCode >= 400) logger.error(`[${response.status}] - ${response.error}`);

  return response;
};

bot.rest = createRestManager({
  token: DISCORD_TOKEN,
  secretKey: REST_AUTHORIZATION,
  runMethod: async (rest, method, route, body, options) =>
    runMethod(restClient, rest, method, route, body, options),
  sendRequest: async (rest, options) =>
    sendRequest(
      restClient,
      rest,
      options.method,
      options.url,
      options.bucketId,
      options.retryCount,
      options.payload,
    ),
});
*/

logger.info('[READY] Events are being processed!');

let content = '';
const builtins = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};
// eslint-disable-next-line
for (const printFunction in builtins) {
  console[printFunction] = function () {
    // eslint-disable-next-line prefer-rest-params
    builtins[printFunction].apply(console, [...arguments]);
    try {
      // eslint-disable-next-line prefer-rest-params
      const message = [...arguments]
        .reduce((accumulator, current) => `${accumulator} ${current} `, '')
        .replace(/\s+$/, '');

      content += `\n${
        printFunction == 'log' ? '+ ' : printFunction == 'error' ? '- ' : ''
      }${message.replace(
        // eslint-disable-next-line no-control-regex
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        '',
      )}`;

      if (content.length > 300) {
        bot.helpers.sendMessage('1063124831211630622', {
          content: `\`\`\`diff\n${content}\n \`\`\``,
        });
        content = '';
      }
    } catch (e) {
      console.error(e);
    }
  };
}
console.log(colors.green('STARTING'));

process.on('unhandledRejection', (error: Error) => {
  console.error(error);
});

process.on('warning', (warn) => {
  console.warn(warn);
});
export { bot };
