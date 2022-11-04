import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel, Guild } from 'discordeno/transformers';
import { ChannelTypes } from 'discordeno/types';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, channel: Channel, guild: Guild) => {
	if (channel.type == ChannelTypes.GuildVoice) {
		try {
			const channels = await client.helpers.getChannels(guild.id);
			let channelName = await client.extras.getTemplate(guild.id);
			channelName = channelName.replace(`{emoji}`, '💬');
			channelName = channelName.replace(
				`{name}`,
				`Text Channels: ${channels.filter((channel) => channel.type === ChannelTypes.GuildVoice).size || 0}`,
			);

			const data = await Schema.findOne({ Guild: guild.id });
			client.helpers.editChannel(data.VoiceChannels, {
				name: channelName,
			});
		} catch {
			//Fix lint error
		}
	}
};
