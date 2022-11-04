import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno/transformers';

export default async (client: AmethystBot, channel: Channel, oldTopic: string, newTopic: string) => {
	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Channel topic adjusted`,
				desc: `One channel topic modified`,
				fields: [
					{
						name: `→ Old Topic`,
						value: `${oldTopic}`,
					},
					{
						name: `→ New Topic`,
						value: `${newTopic}`,
					},
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
				],
			},
			logsChannel,
		)
		.catch();
};
