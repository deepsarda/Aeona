import { AeonaBot } from '../../extras/index.js';
import { Guild } from 'discordeno';

export default async (client: AeonaBot, guild: Guild, url: string) => {
	const logsChannel = await client.extras.getLogs(guild.id);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔗 New Vanity URL`,
				desc: `The server vanity URL has been updated`,
				fields: [
					{
						name: `→ URL`,
						value: `${url}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
