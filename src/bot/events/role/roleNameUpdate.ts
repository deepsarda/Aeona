import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Role } from 'discordeno';
export default async (client: AmethystBot, role: Role, oldName: string, newName: string) => {
	const logsChannel = await client.extras.getLogs(role.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🧻 Role name updated`,
				desc: `A role has been updated`,
				fields: [
					{
						name: `→ Role`,
						value: `<@&${role.id}>`,
					},
					{
						name: `→ Before`,
						value: `${oldName}`,
					},
					{
						name: `→ After`,
						value: `${newName}`,
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
