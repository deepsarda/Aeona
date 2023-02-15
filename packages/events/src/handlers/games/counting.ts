import { Channel, Message, MessageTypes } from 'discordeno';

import count from '../../database/models/count.js';
import countSchema from '../../database/models/countChannel.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot) => {
  client.on('messageCreateNoBots', async (bot: AeonaBot, message: Message) => {
    if (!message.guildId) return;
    if (!message.content || message.type == MessageTypes.ChannelPinnedMessage)
      return;
    const data = await countSchema.findOne({
      Guild: message.guildId,
      Channel: message.channelId,
    });
    const countData = await count.findOne({ Guild: message.guildId });

    if (data && countData) {
      if (!Number(message.content) || Number.isNaN(Number(message.content)))
        return;
      client.emit('logFeatureUse', 'counting');
      if (`${message.authorId}` == countData.User!) {
        try {
          client.extras.errNormal(
            {
              error: 'You cannot count twice in a row',
              type: 'reply',
            },
            { id: message.channelId } as Channel,
          );

          return bot.helpers.addReaction(
            message.channelId,
            `${message.id}`,
            client.extras.emotes.normal.error,
          );
        } catch (error) {
          bot.helpers.addReaction(
            message.channelId,
            `${message.id}`,
            client.extras.emotes.normal.error,
          );
          throw error;
        }
      } else if (Number(message.content) == countData.Count) {
        bot.helpers.addReaction(
          message.channelId,
          `${message.id}`,
          client.extras.emotes.normal.check,
        );
        countData.User = `${message.authorId}`;
        countData.Count += 1;
        countData.save();
      } else {
        try {
          client.extras.errNormal(
            {
              error: `The correct number was ${countData.Count}!`,
              type: 'reply',
            },
            { id: message.channelId } as Channel,
          );

          return bot.helpers.addReaction(
            message.channelId,
            `${message.id}`,
            client.extras.emotes.normal.error,
          );
        } catch (error) {
          bot.helpers.addReaction(
            message.channelId,
            `${message.id}`,
            client.extras.emotes.normal.error,
          );
          throw error;
        }
      }
    } else if (data) {
      if (Number(message.content) == (countData?.Count ?? 0) + 1) {
        bot.helpers.addReaction(
          message.channelId,
          `${message.id}`,
          client.extras.emotes.normal.check,
        );
        new count({
          Guild: message.guildId,
          User: message.authorId,
          Count: (countData?.Count ?? 0) + 1,
        }).save();
      } else {
        return bot.helpers.addReaction(
          message.channelId,
          `${message.id}`,
          client.extras.emotes.normal.error,
        );
      }
    }
  });

  client.on(
    'messageDeleteWithOldMessage',
    async (bot: AeonaBot, message: Message) => {
      try {
        const data = await countSchema.findOne({
          Guild: message.guildId,
          Channel: message.channelId,
        });
        const countData = await count.findOne({ Guild: message.guildId });

        if (data && countData) {
          const lastCount = countData.Count! - 1;
          if (Number(message.content) == lastCount) {
            client.extras.simpleMessageEmbed(
              {
                title: ``,
                desc: `**${`${
                  (await bot.helpers.getUser(message.authorId))?.username
                }#${
                  (await bot.helpers.getUser(message.authorId))?.discriminator
                }`}**: ${message.content}`,
              },
              message,
            );
          }
        }
      } catch {
        //
      }
    },
  );
};
