import { AmethystBot } from '@thereallonewolf/amethystframework';
import { BitwisePermissionFlags, Role } from 'discordeno';

export default async (client: AmethystBot, role: Role, oldPerms: bigint, newPerms: bigint) => {
	const logsChannel = await client.extras.getLogs(role.guildId);
	if (!logsChannel) return;
	const s = BitwisePermissionFlags[Number(oldPerms)];
	const s2 = BitwisePermissionFlags[Number(newPerms)];

	client.extras
		.embed(
			{
				title: `🧻 Role permissions updated`,
				desc: `A role has been updated`,
				fields: [
					{
						name: `→ Role`,
						value: `<@&${role.id}>`,
					},
					{
						name: `→ Before`,
						value: s,
					},
					{
						name: `→ After`,
						value: s2,
					},
					{
						name: `→ ID`,
						value: `${role.id}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
