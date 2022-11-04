import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno/transformers';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, guild: Guild) => {
	try {
		let channelName = await client.extras.getTemplate(guild.id);
		const roles = await client.helpers.getRoles(guild.id);
		channelName = channelName.replace(`{emoji}`, '👔');
		channelName = channelName.replace(`{name}`, `Roles: ${roles.size}`);

		const data = await Schema.findOne({ Guild: guild.id });
		client.helpers.editChannel(data.Roles, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
