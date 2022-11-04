import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel, Guild } from 'discordeno/transformers';

export default async (client: AmethystBot, guild: Guild, afkChannel: Channel) => {
	const logsChannel = await client.extras.getLogs(guild.id);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🛑 New AFK channel`,
				desc: `An AFK channel has been added to the server`,
				fields: [
					{
						name: `→ Channel`,
						value: `${afkChannel}`,
					},
					{
						name: `→ Name`,
						value: `${afkChannel.name}`,
					},
					{
						name: `→ ID`,
						value: `${afkChannel.id}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
