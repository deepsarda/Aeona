import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno/transformers';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, channel: Channel) => {
	try {
		let channelName = await client.extras.getTemplate(channel.guildId);
		const channels = await client.helpers.getChannels(channel.guildId);
		channelName = channelName.replace(`{emoji}`, '🔧');
		channelName = channelName.replace(`{name}`, `Channels: ${channels.size}`);

		const data = await Schema.findOne({ Guild: channel.guildId });
		client.helpers.editChannel(data.Channels, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
