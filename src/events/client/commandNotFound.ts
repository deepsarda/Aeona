import { Point } from '@influxdata/influxdb-client';
import { Message } from '@discordeno/bot';
import fetch from 'node-fetch';

import chatBotSchema from '../../database/models/chatbot-channel.js';
import GuildDB from '../../database/models/guild.js';
import { AeonaBot } from '../../extras/index.js';

export default async (bot: AeonaBot, message: Message, _commandName: string) => {
  if (bot.extras.botConfig.Disabled.includes('chatbot')) return;

  const schema = await chatBotSchema.findOne({ Guild: message.guildId });
  if (schema) if (schema.Channel == `${message.channelId}`) return;
  const url = `http://localhost:8083/chatbot?text=${encodeURIComponent(message.content)}&userId=${
    message.author.id
  }&key=${process.env.apiKey}`;

  const options = {
    method: 'GET',
  };
  if (!message.id) return;
  fetch(url, options)
    .then((res) => res.text())
    .then(async (json) => {
      bot.extras.influx?.writePoint(
        new Point('commands').tag('action', 'addition').tag('command', 'chatbot').intField('value', 1),
      );
      let s = [
        '\n discord.gg/W8hssA32C9',
        '\n To get a chance to win Discord Nitro for 1 month, take part in my competition. To know more see `/info competition` \n ',
      ];
      let guild = await GuildDB.findOne({
        Guild: message.guildId,
      });
      if (!guild) guild = new GuildDB({ Guild: message.guildId });
      if (guild.isPremium === 'true') s = ['', ''];
      const randomNumber = Math.floor(Math.random() * 30);
      json = randomNumber == 0 ? (json ?? '') + s[0] : randomNumber == 1 ? (json ?? '') + s[1] : json;
      await bot.helpers.sendMessage(message.channelId, {
        content: json,
        messageReference: {
          channelId: message.channelId,
          messageId: `${message.id}`,
          guildId: message.guildId,
          failIfNotExists: true,
        },
        allowedMentions: {
          parse: [],
          repliedUser: true,
        },
      });
      console.log(`BOT`.blue.bold, `>>`.white, `Chatbot Used Command Not Found`.red);
      bot.extras.influx?.writePoint(new Point('commandruncount').tag('action', 'addition').intField('usage', 1));
    })

    .catch((err) => console.error(`error:${err}`));
};
