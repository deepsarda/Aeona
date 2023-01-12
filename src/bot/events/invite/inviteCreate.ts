import { Invite } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, invite: Invite) => {
	const logsChannel = await client.extras.getLogs(invite.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `📨 Invite created`,
				desc: `A invite has been created`,
				fields: [
					{
						name: `💬 Code`,
						value: `${invite.code}`,
					},
					{
						name: `<:members:1063116392762712116> Inviter`,
						value: `<@${invite.inviter?.id}> (${invite.inviter?.username + '#' + invite.inviter?.discriminator})`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
