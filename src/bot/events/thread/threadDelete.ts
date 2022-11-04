import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';
export default async (client: AmethystBot, channel: Channel) => {
	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `📖 Thread deleted`,
				desc: `A thread has been deleted`,
				fields: [
					{
						name: `→ Name`,
						value: `${channel.name}`,
					},
					{
						name: `→ ID`,
						value: `${channel.id}`,
					},
					{
						name: `→ Type`,
						value: `${channel.type}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
