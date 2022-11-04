import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Member } from 'discordeno/transformers';
import Schema from '../../database/models/boostChannels.js';
import Schema2 from '../../database/models/boostMessage.js';

export default async (client: AmethystBot, member: Member) => {
	try {
		const channelData = await Schema.findOne({ Guild: member.guildId });
		const messageData = await Schema2.findOne({ Guild: member.guildId });

		if (messageData) {
			const tier = {
				TIER_1: `1 `,
				TIER_2: `2`,
				TIER_3: `3`,
				NONE: `0`,
			};
			const guild = await client.cache.guilds.get(member.guildId);
			if (!guild) return;
			let boostMessage = messageData.boostMessage!;
			boostMessage = boostMessage.replace(`{user:username}`, member.user?.username!);
			boostMessage = boostMessage.replace(`{user:discriminator}`, member.user?.discriminator!);
			boostMessage = boostMessage.replace(`{user:tag}`, member.user?.username + '#' + member.user?.discriminator);
			boostMessage = boostMessage.replace(`{user:mention}`, member);

			boostMessage = boostMessage.replace(`{guild:name}`, guild.name);
			boostMessage = boostMessage.replace(`{guild:members}`, guild.memberCount);
			boostMessage = boostMessage.replace(`{guild:boosts}`, guild.premiumSubscriptionCount);
			boostMessage = boostMessage.replace(`{guild:booststier}`, guild.premiumTier);

			if (channelData) {
				try {
					const channel = await client.cache.channels.get(channelData.Channel);

					client.extras.embed(
						{
							title: `🚀 New boost`,
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
					const channel = await client.cache.channels.get(channelData.Channel!);

					client.extras.embed(
						{
							title: `🚀 New boost`,
							desc: `${member} boosted the server!`,
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
