import { AmethystBot } from '@thereallonewolf/amethystframework';
import { User } from 'discordeno';

export default async (client: AmethystBot, ban: User, guildId: bigint) => {
	const logsChannel = await client.extras.getLogs(guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Member banned`,
				desc: `A user has been banned`,
				thumbnail: client.helpers.getAvatarURL(ban.id + '', ban.discriminator, {
					avatar: ban.avatar,
				}),
				fields: [
					{
						name: `→ User`,
						value: `<@${ban.id}>`,
					},
					{
						name: `→ Tag`,
						value: `${ban.username + '' + ban.discriminator}`,
					},
					{
						name: `→ ID`,
						value: `${ban.id}`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
