import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Emoji, Guild } from 'discordeno/transformers';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, emoji: Emoji, guild: Guild) => {
	if (emoji.toggles.animated) {
		try {
			let Animated = 0;
			const emojies = await client.helpers.getEmojis(guild.id);
			emojies.forEach((emoji) => {
				if (emoji.toggles.animated) {
					Animated++;
				}
			});

			let channelName = await client.extras.getTemplate(guild.id);
			channelName = channelName.replace(`{emoji}`, '🤡');
			channelName = channelName.replace(`{name}`, `Animated Emojis: ${Animated || '0'}`);

			const data = await Schema.findOne({ Guild: guild.id });

			client.helpers.editChannel(data.AnimatedEmojis, {
				name: channelName,
			});
		} catch {
			//Fix lint error
		}
	}
};
