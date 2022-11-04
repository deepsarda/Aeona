import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno/transformers';

export default async (client: AmethystBot, channel: Channel, oldName: string, newName: string) => {
	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Channel name adjusted`,
				desc: `One channel name modified`,
				fields: [
					{
						name: `→ Old Name`,
						value: `${oldName}`,
					},
					{
						name: `→ New Name`,
						value: `${newName}`,
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
				],
			},
			logsChannel,
		)
		.catch();
};
