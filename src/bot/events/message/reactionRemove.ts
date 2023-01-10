import { Emoji, User } from 'discordeno/transformers';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
	client: AeonaBot,
	reaction: {
		userId: bigint;
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
		user?: User;
		emoji: Emoji;
	},
) => {
	if (reaction.emoji.name === '⭐') {
		const data = await StarBoard.findOne({ Guild: reaction.guildId });
		if (!data) return;

		const starboardChannel = await client.helpers.getChannel(data.Channel!);
		if (!starboardChannel) return;

		const fetch = await client.helpers.getMessages(starboardChannel.id + '', {
			limit: 100,
		});
		const stars = fetch.find((m) => {
			return m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.endsWith(reaction.messageId + '')
				? true
				: false;
		});

		if (stars) {
			const foundStar = stars.embeds[0];
			const message = await client.helpers.getMessage(reaction.channelId, reaction.messageId);

			const image = message.embeds[0].image?.url;
			const starMsg = await client.helpers.getMessage(starboardChannel.id + '', stars.id);

			if (
				!message.reactions?.find((r) => r.emoji.name == '⭐')?.count ||
				message.reactions?.find((r) => r.emoji.name == '⭐')?.count == 0
			) {
				client.helpers.deleteMessage(starboardChannel.id + '', starMsg.id);
			} else {
				const user = await client.helpers.getUser(reaction.userId);
				client.extras.editEmbed(
					{
						title: `Starboard`,
						desc: foundStar.description,
						image: image,
						author: {
							name: user.username + '#' + user.discriminator,
							iconURL: client.helpers.getAvatarURL(user.id, user.discriminator, {
								avatar: user.avatar,
							}),
						},
						fields: [
							{
								name: `→ Stars`,
								value: `${message.reactions?.find((r) => r.emoji.name == '⭐')?.count || 1}`,
								inline: true,
							},
							{
								name: `→ Message`,
								value: `[Jump to the message](https://discord.com/channels/${reaction.guildId}/${reaction.channelId}/${reaction.messageId})`,
								inline: true,
							},
							{
								name: `→ Author`,
								value: `<@${message.authorId}>`,
								inline: true,
							},
						],
						footer: message.embeds[0].footer?.text,
					},
					starMsg,
				);
			}
		}
	}
};
