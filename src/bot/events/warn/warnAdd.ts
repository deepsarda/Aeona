import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, user, mod) => {
	const logsChannel = await client.extras.getLogs(user.guild.id);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `🔨 Member warned`,
				desc: `A user has been warned`,
				fields: [
					{
						name: `→ User`,
						value: `<@${user.id}>`,
					},
					{
						name: `→ Tag`,
						value: `${user.user.username}#${user.user.discriminator}`,
					},
					{
						name: `→ ID`,
						value: `${user.id}`,
					},
					{
						name: `→ Moderator`,
						value: `${mod} (${mod.id})`,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
