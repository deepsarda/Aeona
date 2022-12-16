import { AeonaBot } from '../../extras/index.js';
import { Guild } from 'discordeno/transformers';

import Schema from '../../database/models/stats.js';

export default async (client: AeonaBot, guild: Guild) => {
	try {
		let channelName = await client.extras.getTemplate(guild.id);
		channelName = channelName.replace(`{emoji}`, '💎');
		channelName = channelName.replace(`{name}`, `Boosts: ${guild.premiumSubscriptionCount || '0'}`);

		const data = await Schema.findOne({ Guild: guild.id });
		if (!data || !data.Boost) return;
		client.helpers.editChannel(data.Boost, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
