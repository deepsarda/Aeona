import { Member } from 'discordeno/transformers';

import Schema from '../../database/models/boostChannels.js';
import Schema2 from '../../database/models/boostMessage.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, member: Member) => {
	try {
		const channelData = await Schema.findOne({ Guild: member.guildId });
		const messageData = await Schema2.findOne({ Guild: member.guildId });

		if (messageData) {
			const guild = await client.cache.guilds.get(member.guildId);
			if (!guild) return;
			let boostMessage = messageData.boostMessage!;
			const u = await client.helpers.getUser(member.id);
			boostMessage = boostMessage.replace(`{user:username}`, u.username!);
			boostMessage = boostMessage.replace(`{user:discriminator}`, u.discriminator!);
			boostMessage = boostMessage.replace(`{user:tag}`, u.username + '#' + u.discriminator);
			boostMessage = boostMessage.replace(`{user:mention}`, '<@' + member.id + '>');

			boostMessage = boostMessage.replace(`{guild:name}`, guild.name);
			boostMessage = boostMessage.replace(`{guild:members}`, guild.approximateMemberCount! + '');
			boostMessage = boostMessage.replace(`{guild:boosts}`, guild.premiumSubscriptionCount! + '');
			boostMessage = boostMessage.replace(`{guild:booststier}`, guild.premiumTier + '');

			if (channelData) {
				try {
					const channel = await client.helpers.getChannel(BigInt(channelData.Channel!));

					client.extras.embed(
						{
							title: `🚀 New boost`,
							desc: boostMessage,
						},
						channel!,
					);
				} catch {
					//prevent lint errors
				}
			}
		} else {
			if (channelData) {
				try {
					const channel = await client.helpers.getChannel(BigInt(channelData.Channel!));

					client.extras.embed(
						{
							title: `🚀 New boost`,
							desc: `${member} boosted the server!`,
						},
						channel!,
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
