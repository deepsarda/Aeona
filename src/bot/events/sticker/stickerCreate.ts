import { Sticker } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, sticker: Sticker) => {
	const logsChannel = await client.extras.getLogs(sticker.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `😜 Sticker created`,
				desc: `A sticker has been created`,
				fields: [
					{
						name: `<:name:1062774821190111272>  Name`,
						value: `${sticker.name}`,
					},
					{
						name: `<:id:1062774182892552212> ID`,
						value: `${sticker.id}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
