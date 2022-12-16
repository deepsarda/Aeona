import { AeonaBot } from '../../extras/index.js';
import { User } from 'discordeno/transformers';

export default async (client: AeonaBot, ban: User, guildId: bigint) => {
	const logsChannel = await client.extras.getLogs(guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔧 Member unbanned`,
				desc: `A user has been unbanned`,
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
