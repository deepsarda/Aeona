import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Sticker } from 'discordeno/transformers';

export default async (client: AmethystBot, sticker: Sticker) => {
	const logsChannel = await client.extras.getLogs(sticker.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `😜 Sticker created`,
				desc: `A sticker has been created`,
				fields: [
					{
						name: `→ Name`,
						value: `${sticker.name}`,
					},
					{
						name: `→ ID`,
						value: `${sticker.id}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
