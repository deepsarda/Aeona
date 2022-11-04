import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno';

import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, guild: Guild) => {
	try {
		const members = await client.helpers.getMembers(guild.id, {});

		let channelName = await client.extras.getTemplate(guild.id);
		channelName = channelName.replace(`{emoji}`, '🤖');
		channelName = channelName.replace(
			`{name}`,
			`Bots: ${members.filter((member) => (member.user?.toggles.bot ? true : false)).size || 0}`,
		);

		const data = await Schema.findOne({ Guild: guild.id });
		client.helpers.editChannel(data.Bots, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
