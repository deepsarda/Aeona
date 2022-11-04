import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno/transformers';
import { PremiumTiers } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
/* A type definition for the client. */

export default async (client: AmethystBot, guild: Guild) => {
	const tier = {
		TIER_1: `1`,
		TIER_2: `2`,
		TIER_3: `3`,
		NONE: `0`,
	};

	try {
		let channelName = await client.extras.getTemplate(guild.id);
		channelName = channelName.replace(`{emoji}`, '🥇');
		channelName = channelName.replace(`{name}`, `Tier: ${PremiumTiers[guild.premiumTier] || '0'}`);

		const data = await Schema.findOne({ Guild: guild.id });
		client.helpers.editChannel(data.BoostTier, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
