import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Emoji, Member, User } from 'discordeno/transformers';

import StarBoard from '../../database/models/starboardChannels.js';

export default async (
	client: AmethystBot,
	reaction: {
		userId: bigint;
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
		member?: Member;
		user?: User;
		emoji: Emoji;
	},
) => {
	if (reaction.emoji.name === '⭐') {
		const data = await StarBoard.findOne({ Guild: reaction.guildId });
		if (!data) return;

		const starboardChannel = await client.helpers.getChannel(data.Channel);
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

			const image = message.attachments.length > 0 ? await extension(reaction, message.attachments[0]?.url) : '';
			const starMsg = await client.helpers.getMessage(starboardChannel.id + '', stars.id);

			if (message.reactions?.find((r) => r.emoji.name == '⭐')?.count) {
				client.helpers.deleteMessage(starboardChannel.id + '', starMsg.id);
			} else {
				client.extras.editEmbed(
					{
						title: `Starboard`,
						desc: foundStar.description,
						image: image,
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
						footer: `${client.extras.config.discord.footer} | ${reaction.messageId}`,
						type: 'edit',
					},
					starMsg,
				);
			}
		}
	}
};
function extension(
	reaction: {
		userId: bigint;
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
		member?: Member;
		user?: User;
		emoji: Emoji;
	},
	attachment: string,
) {
	const imageLink = attachment.split('.');
	const typeOfImage = imageLink[imageLink.length - 1];
	const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
	if (!image) return '';
	return attachment;
}
