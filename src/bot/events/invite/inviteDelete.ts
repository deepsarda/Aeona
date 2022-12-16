import { AeonaBot } from '../../extras/index.js';
import { Invite } from 'discordeno';

export default async (client: AeonaBot, invite: Invite) => {
	const logsChannel = await client.extras.getLogs(invite.guildId);
	if (!logsChannel) return;
	client.extras
		.embed(
			{
				title: `📨 Invite deleted`,
				desc: `A invite has been deleted`,
				fields: [
					{
						name: `→ Code`,
						value: `${invite.code}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
