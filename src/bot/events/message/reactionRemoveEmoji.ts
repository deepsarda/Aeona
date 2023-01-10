import { Emoji } from 'discordeno/transformers';

import StarBoard from '../../database/models/starboardChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
	client: AeonaBot,
	reaction: {
		channelId: bigint;
		messageId: bigint;
		guildId?: bigint;
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

		if (stars)
			client.helpers.deleteMessage(starboardChannel.id + '', stars.id);
	}
};
