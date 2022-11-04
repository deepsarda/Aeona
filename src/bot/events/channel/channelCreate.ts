import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';
export default async (client: AmethystBot, channel: Channel) => {
	const types = {
		GUILD_TEXT: 'Text Channel',
		GUILD_VOICE: 'Voice Channel',
		GUILD_CATEGORY: 'Category',
		UNKNOWN: 'No Type',
		GUILD_NEWS: 'News Channel',
		GUILD_STAGE_VOICE: 'Stage Channel',
		GUILD_STORE: 'Store Channel',
		GUILD_NEWS_THREAD: 'News Thread',
		GUILD_PUBLIC_THREAD: 'Public Thread',
		GUILD_PRIVATE_THREAD: 'Private Thread',
	};

	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Channel created`,
				desc: `A channel has been created`,
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
				],
			},
			logsChannel,
		)
		.catch();
};
