import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Role } from 'discordeno';
export default async (client: AmethystBot, role: Role) => {
	const logsChannel = await client.extras.getLogs(role.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🧻 Role deleted`,
				desc: `A role has been deleted`,
				fields: [
					{
						name: `→ Role`,
						value: `<&${role.id}>`,
					},
					{
						name: `→ Name`,
						value: `${role.name}`,
					},
					{
						name: `→ ID`,
						value: `${role.id}`,
					},
					{
						name: `→ Color`,
						value: `#${role.color.toString(16)}`,
					},
					{
						name: `→ Position`,
						value: `${role.position}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
