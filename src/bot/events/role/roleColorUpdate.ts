import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Role } from 'discordeno';
export default async (client: AmethystBot, role: Role, oldColor: number, newColor: number) => {
	const logsChannel = await client.extras.getLogs(role.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🧻 Role color updated`,
				desc: `A role has been updated`,
				fields: [
					{
						name: `→ Role`,
						value: `<&${role.id}>`,
					},
					{
						name: `→ Before`,
						value: `#${oldColor.toString(16)}`,
					},
					{
						name: `→ After`,
						value: `#${newColor.toString(16)}`,
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
