import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel } from 'discordeno';
import ticketChannels from '../../database/models/ticketChannels.js';

export default async (client: AmethystBot, channel: Channel) => {
	const logsChannel = await client.extras.getLogs(channel.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Channel deleted`,
				desc: `A channel has been deleted`,
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

	try {
		ticketChannels.findOne({ Guild: channel.guildId, channelID: channel.id }, async (err: any, data: any) => {
			if (data) {
				const remove = await ticketChannels.deleteOne({
					Guild: channel.guildId,
					channelID: channel.id,
				});
			}
		});
	} catch {
		//prevent linet error
	}
};
