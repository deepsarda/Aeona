import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Invite } from 'discordeno/transformers';
export default async (client: AmethystBot, invite: Invite) => {
	const logsChannel = await client.extras.getLogs(invite.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `📨 Invite created`,
				desc: `A invite has been created`,
				fields: [
					{
						name: `→ Code`,
						value: `${invite.code}`,
					},
					{
						name: `→ Inviter`,
						value: `<@${invite.inviter?.id}> (${invite.inviter?.username + '#' + invite.inviter?.discriminator})`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
