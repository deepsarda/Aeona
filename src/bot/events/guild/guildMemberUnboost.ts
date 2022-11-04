import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Member } from 'discordeno';
import Schema from '../../database/models/boostChannels.js';
import Schema2 from '../../database/models/boostMessage.js';

export default async (client: AmethystBot, member: Member) => {
	try {
		const channelData = await Schema.findOne({ Guild: member.guildId });
		const messageData = await Schema2.findOne({ Guild: member.guildId });

		if (messageData) {
			const guild = await client.cache.guilds.get(member.guildId);
			if (!guild) return;

			let boostMessage = messageData.unboostMessage!;
			boostMessage = boostMessage.replace(`{user:username}`, member.user?.username);
			boostMessage = boostMessage.replace(`{user:discriminator}`, member.user?.discriminator);
			boostMessage = boostMessage.replace(`{user:tag}`, member.user?.username + '#' + member.user?.discriminator);
			boostMessage = boostMessage.replace(`{user:mention}`, member);

			boostMessage = boostMessage.replace(`{guild:name}`, guild.name);
			boostMessage = boostMessage.replace(`{guild:members}`, guild.memberCount);
			boostMessage = boostMessage.replace(`{guild:boosts}`, guild.premiumSubscriptionCount);
			boostMessage = boostMessage.replace(`{guild:booststier}`, guild.premiumTier);

			if (channelData) {
				try {
					const channel = await client.helpers.getChannel(channelData.Channel);

					client.extras.embed(
						{
							title: `🚀 New unboost`,
							desc: boostMessage,
						},
						channel,
					);
				} catch {
					//prevent lint errors
				}
			}
		} else {
			if (channelData) {
				try {
					const channel = client.cache.channels.get(channelData.Channel);

					client.extras.embed(
						{
							title: `🚀 New unboost`,
							desc: `${member} unboosted the server!`,
						},
						channel,
					);
				} catch {
					//prevent lint errors
				}
			}
		}
	} catch {
		//prevent lint errors
	}
};
