import { Point } from '@influxdata/influxdb-client';
import { Components } from '@thereallonewolf/amethystframework';
import Filter from 'badwords-filter';
import { BigString, Message } from 'discordeno';
import fetch from 'node-fetch';

import afk from '../../database/models/afk.js';
import chatBotSchema from '../../database/models/chatbot-channel.js';
import GuildDB from '../../database/models/guild.js';
import levelSchema from '../../database/models/levelChannels.js';
import levelRewards from '../../database/models/levelRewards.js';
import messageRewards from '../../database/models/messageRewards.js';
import messagesSchema from '../../database/models/messages.js';
import Schema from '../../database/models/stickymessages.js';
import { AeonaBot } from '../../extras/index.js';
import { Influx } from '../client/commandStart.js';
import badwords from '../../Collection/badwords.js';
console.log(badwords);
const filter = new Filter({
  list: badwords,
  useRegex: true
});
export default async (client: AeonaBot, message: Message) => {
  if (
    message.content == `<@!${client.user?.id}>` ||
    message.content == `<@${client.user?.id}>`
  ) {
    let guild = await GuildDB.findOne({
      Guild: message.guildId,
    });
    if (!guild) guild = new GuildDB({ Guild: message.guildId });

    if (!guild.Prefix) {
      guild.Prefix = process.env.BOTPREFIX!;
      guild.save();
    }

    client.extras.sendEmbedMessage(
      {
        title: `Hi there!`,
        desc: `My prefix is \`${guild.Prefix}\`.
Let me help you get your server going.

**Want to setup chatbot?**
Use \`${guild.Prefix}setup chatbot <channel>\` or
\`${guild.Prefix}autosetup chatbot\` to have me make a channel for you.

**Want to setup bump reminder?**
Well then run \`${guild.Prefix}bumpreminder setup <channel> <role>\`

**Want to generate some art?**
Use \`${guild.Prefix}imagine <prompt>\`

Use the  \`${guild.Prefix}help\` to see all my commands.`,
      },
      message,
    );
  }
  // Levels
  GuildDB.findOne(
    { Guild: message.guildId },
    async (err: any, data: { Levels: boolean }) => {
      if (data) {
        if (data.Levels == true) {
          const randomXP = Math.floor(Math.random() * 9) + 1;
          const hasLeveledUp = await client.extras.addXP(
            message.authorId,
            message.guildId!,
            randomXP,
          );

          if (hasLeveledUp) {
            const user = await client.extras.fetchLevels(
              message.authorId,
              message.guildId!,
            );
            if (!user) return;

            const schemas = await levelSchema.find({
              Guild: message.guildId,
            });
            if (schemas.length > 0) {
              const config = await client.extras.getEmbedConfig({
                guild: (await client.cache.guilds.get(message.guildId!))!,
                user: (await client.cache.users.get(message.authorId))!,
              });

              for (let i = 0; i < schemas.length; i++) {
                const schema = schemas[i];

                let message = {
                  content:
                    '**GG** {user:mention}, you are now level **{user:level}**!',
                };

                if (schema.Message) {
                  try {
                    message = JSON.parse(schema.Message);
                  } catch (e) {
                    //
                  }
                }
                if (schema.Channel)
                  client.helpers
                    .sendMessage(
                      schema.Channel,
                      client.extras.generateEmbedFromData(config, message),
                    )
                    .catch();
              }
            } else {
              client.helpers.sendMessage(message.channelId, {
                content: `**GG** <@!${message.authorId}>, you are now level **${user.level}**!`,
              });
            }

            levelRewards.findOne(
              { Guild: message.guildId, Level: user.level },
              async (err: any, data: { Role: BigString }) => {
                if (data) {
                  await client.helpers.addRole(
                    message.guildId!,
                    message.authorId,
                    data.Role,
                  );
                }
              },
            );
          }
        }
      }
    },
  );

  // Message tracker system
  messagesSchema.findOne(
    { Guild: message.guildId, User: message.authorId },
    async (err: any, data: { Messages: number; save: () => void }) => {
      if (data) {
        data.Messages += 1;
        data.save();

        messageRewards.findOne(
          { Guild: message.guildId, Messages: data.Messages },
          async (err: any, data: { Role: BigString }) => {
            if (data) {
              try {
                await client.helpers.addRole(
                  message.guildId!,
                  message.authorId,
                  data.Role,
                );
              } catch {
                //prevent lint error
              }
            }
          },
        );
      } else {
        new messagesSchema({
          Guild: message.guildId,
          User: message.authorId,
          Messages: 1,
        }).save();
      }
    },
  );

  // AFK system
  afk.findOne(
    { Guild: message.guildId, User: message.authorId },
    async (err: any, data: any) => {
      if (data) {
        await afk.deleteOne({
          Guild: message.guildId,
          User: message.authorId,
        });

        client.extras.simpleMessageEmbed(
          {
            desc: `<@${message.authorId}> is no longer afk!`,
          },
          message,
        );

        if (message.member?.nick?.startsWith(`[AFK] `)) {
          const name = message.member?.nick?.replace(`[AFK] `, ``);
          client.helpers.editMember(message.guildId!, message.authorId, {
            nick: name,
          });
        }
      }
    },
  );

  message.mentionedUserIds.forEach(async (u) => {
    if (
      !message.content.includes('@here') &&
      !message.content.includes('@everyone')
    ) {
      afk.findOne(
        { Guild: message.guildId, User: u },
        async (err: any, data: { Message: any }) => {
          if (data) {
            client.extras.simpleMessageEmbed(
              { desc: `<@${u}> is currently afk! **Reason:** ${data.Message}` },
              message,
            );
          }
        },
      );
    }
  });

  // Chat bot
  if (message.content)
    chatBotSchema.findOne(
      { Guild: `${message.guildId}`, Channel: `${message.channelId}` },
      async (err, data) => {
        if (!data) return;

        if (message.channelId != data.Channel) return;
        const msgs: Message[] = Array.from(
          (
            await client.helpers.getMessages(message.channelId, {
              limit: 6,
            })
          ).values(),
        ).sort((a, b) => b.timestamp - a.timestamp);
        let context;
        let context1;
        let context2;
        let context3;
        let context4;
        let context5;
        try {
          context = msgs[1].content;
          context1 = msgs[2].content;
          context2 = msgs[3].content;
          context3 = msgs[4].content;
          context4 = msgs[5].content;
          context5 = msgs[6].content;
        } catch (e) {
          //ignore error
        }
        const url = `http://localhost:8083/chatbot?text=${encodeURIComponent(
          message.content,
        )}&userId=${message.authorId}&key=${process.env.apiKey}${context ? `&context=${context}` : ''
          }${context1 ? `&context1=${context1}` : ''} ${context2 ? `&context2=${context2}` : ''
          } ${context3 ? `&context3=${context3}` : ''} ${context4 ? `&context4=${context4}` : ''
          } ${context5 ? `&context5=${context5}` : ''}`;

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

            let s = [
              '\n discord.gg/W8hssA32C9',
              '\n Generate beautiful images using /imagine \n ',
            ];
            let guild = await GuildDB.findOne({
              Guild: message.guildId,
            });
            if (!guild) guild = new GuildDB({ Guild: message.guildId });
            if (guild.isPremium === 'true') s = ['', ''];
            console.log(`BOT`.blue.bold, `>>`.white, `Chatbot Used`.red);
            const randomNumber = Math.floor(Math.random() * 30);
            json =
              randomNumber == 0
                ? (json ?? '') + s[0]
                : randomNumber == 1
                  ? (json ?? '') + s[1]
                  : json;
            let component: any[] = [];
            if (!guild.chatbotFilter) {
              if (filter.isUnclean(json)) {
                const c = new Components();
                c.addButton('Why *****?', 'Secondary', 'profane');
                component = c;
                json = filter.clean(json);
              }
            }
            client.helpers.sendMessage(message.channelId, {
              content: json,
              components: component,
              messageReference: {
                channelId: message.channelId,
                messageId: `${message.id}`,
                guildId: message.guildId,
                failIfNotExists: true,
              },
            });

            Influx?.writePoint(
              new Point('commandruncount')
                .tag('action', 'addition')
                .intField('usage', 1),
            );
          })
          .catch();
      },
    );
  // Sticky messages
  try {
    Schema.findOne(
      { Guild: message.guildId, Channel: message.channelId },
      async (
        err: any,
        data: { LastMessage: any; Content: any; save: () => void },
      ) => {
        if (!data) return;

        const lastStickyMessage = await client.helpers.getMessage(
          message.channelId,
          data.LastMessage,
        );
        if (!lastStickyMessage) return;
        client.helpers.deleteMessage(message.channelId, data.LastMessage);

        const newMessage = await client.extras.simpleMessageEmbed(
          { desc: `${data.Content}` },
          message,
        );

        data.LastMessage = newMessage.id;
        data.save();
      },
    );
  } catch {
    //prevent lint error
  }
};
