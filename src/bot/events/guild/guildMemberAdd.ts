import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Member } from 'discordeno';
import roleSchema from '../../database/models/joinRole.js';

export default async (client: AmethystBot, member: Member) => {
	const data = await roleSchema.findOne({ Guild: member.guildId });
	if (data) {
		client.helpers.addRole(member.guildId, member.id + '', data.Role);
	}
};
