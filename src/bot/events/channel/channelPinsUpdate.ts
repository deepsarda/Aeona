import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';

export default async (client: AmethystBot, channel: Channel, time: number) => {
	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Channel pins updated`,
				desc: `Channel pins have been updated`,
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
						name: `→ Channel`,
						value: `<#${channel.id}>`,
					},
					{
						name: `→ Type`,
						value: `${channel.type}`,
					},
					{
						name: `→ Pinned at`,
						value: `<t:${(time / 1000).toFixed(0)}>`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
