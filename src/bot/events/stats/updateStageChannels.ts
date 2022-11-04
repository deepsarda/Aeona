import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';
import { Guild } from 'discordeno/transformers';

import { ChannelTypes } from 'discordeno/types';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, channel: Channel, guild: Guild) => {
	if (channel.type == ChannelTypes.GuildStageVoice) {
		try {
			const channels = await client.helpers.getChannels(guild.id);
			let channelName = await client.extras.getTemplate(guild.id);
			channelName = channelName.replace(`{emoji}`, '🎤');
			channelName = channelName.replace(
				`{name}`,
				`Stage Channels: ${channels.filter((channel) => channel.type === ChannelTypes.GuildStageVoice).size || 0}`,
			);

			const data = await Schema.findOne({ Guild: guild.id });
			client.helpers.editChannel(data.StageChannels, {
				name: channelName,
			});
		} catch {
			//Fix lint error
		}
	}
};
