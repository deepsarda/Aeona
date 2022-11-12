import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message, MessageTypes } from 'discordeno';
import count from '../../database/models/count.js';
import countSchema from '../../database/models/countChannel.js';

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if (!message.guildId) return;
		try {
			if ((await client.cache.users.get(message.authorId)).toggles.bot) return;
		} catch (e) {
			//fix lint error
		}

		if (!message.content || message.type == MessageTypes.ChannelPinnedMessage) return;
		const data = await countSchema.findOne({
			Guild: message.guildId,
			Channel: message.channelId,
		});
		const countData = await count.findOne({ Guild: message.guildId });

		if (data && countData) {
			if (message.authorId + '' == countData.User!) {
				try {
					client.extras.errNormal(
						{
							error: 'You cannot count twice in a row! Count starts again from 1',
							type: 'reply',
						},
						{ id: message.channelId },
					);

					countData.Count = 1;
					countData.User = ' ';
					countData.save();
					return bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
				} catch (error) {
					bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
					throw error;
				}
			} else {
				if (Number(message.content) == countData.Count) {
					bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.check);
					countData.User = message.authorId + '';
					countData.Count += 1;
					countData.save();
				} else {
					try {
						client.extras.errNormal(
							{
								error: `The correct number was ${countData.Count}! Count starts again from 1`,
								type: 'reply',
							},
							{ id: message.channelId },
						);

						countData.Count = 1;
						countData.User = ' ';
						countData.save();
						return bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
					} catch (error) {
						bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
						throw error;
					}
				}
			}
		} else if (data) {
			if (Number(message.content) == (countData?.Count ?? 0) + 1) {
				bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.check);
				new count({
					Guild: message.guildId,
					User: message.authorId,
					Count: (countData?.Count ?? 0) + 1,
				}).save();
			} else {
				return bot.helpers.addReaction(message.channelId, message.id + '', client.extras.emotes.normal.error);
			}
		}
	});

	client.on('messageDelete', async (bot: AmethystBot, message: Message) => {
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
							desc: `**${
								(await bot.cache.users.get(message.authorId))?.username +
								'#' +
								(await bot.cache.users.get(message.authorId))?.discriminator
							}**: ${message.content}`,
						},
						message,
					);
				}
			}
		} catch {
			//
		}
	});
};
