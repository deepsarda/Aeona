import { Point } from '@influxdata/influxdb-client';
import { Message } from 'discordeno/transformers';
import fetch from 'node-fetch';

import Functions from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';
import { Influx } from './commandStart.js';

export default async (bot: AeonaBot, message: Message, _commandName: string) => {
  const url =
    'https://DumBotApi.aeona.repl.co?text=' +
    encodeURIComponent(message.content) +
    '&userId=' +
    message.authorId +
    '&key=' +
    process.env.apiKey;

  const options = {
    method: 'GET',
  };

  fetch(url, options)
    .then((res) => res.text())
    .then(async (json) => {
      Influx?.writePoint(
        new Point('commands')
          .tag('action', 'addition')
          .tag('command', 'chatbot')
          .intField('value', 1),
      );
      let s = ['\n discord.gg/qURxRRHPwa', '\n Generate beautiful images using /imagine \n '];
      let guild = await Functions.findOne({
        Guild: message.guildId,
      });
      if (!guild) guild = new Functions({ Guild: message.guildId });
      if (guild.isPremium === 'true') s = ['', ''];
      const randomNumber = Math.floor(Math.random() * 30);
      json =
        randomNumber == 0 ? (json ?? '') + s[0] : randomNumber == 1 ? (json ?? '') + s[1] : json;
      await bot.helpers.sendMessage(message.channelId, {
        content: json,
        messageReference: {
          channelId: message.channelId,
          messageId: message.id + '',
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });
      console.log(`BOT`.blue.bold, `>>`.white, `Chatbot Used`.red);
      Influx?.writePoint(
        new Point('commandruncount').tag('action', 'addition').intField('usage', 1),
      );
    })

    .catch((err) => console.error('error:' + err));
};
