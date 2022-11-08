import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message, MessageTypes } from 'discordeno';
import count from '../../database/models/count.js';
import countSchema from '../../database/models/countChannel.js';

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if (message.member?.user?.toggles.bot) return;
		if (!message.guildId) return;
		if (message.content || message.attachments.length > 0 || message.type == MessageTypes.ChannelPinnedMessage) return;

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
						message,
					);

					countData.Count = 1;
					countData.User = ' ';
					countData.save();
					return bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
				} catch (error) {
					bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
					throw error;
				}
			} else {
				if (Number(message.content) == countData.Count) {
					bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
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
							message,
						);

						countData.Count = 1;
						countData.User = ' ';
						countData.save();
						return bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
					} catch (error) {
						bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
						throw error;
					}
				}
			}
		} else if (data) {
			if (Number(message.content) == countData!.Count! + 1) {
				bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.check);
				new count({
					Guild: message.guildId,
					User: message.authorId,
					Count: countData!.Count! + 1,
				}).save();
			} else {
				return bot.helpers.addReaction(message.channelId, message.id, client.extras.emotes.normal.error);
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
