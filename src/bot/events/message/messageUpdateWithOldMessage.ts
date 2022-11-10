import { AmethystBot } from '@thereallonewolf/amethystframework';

export default async (client: AmethystBot, oldMessage, newMessage) => {
	try {
		if (!oldMessage.content || !newMessage.content) return;
		if (oldMessage.content === newMessage.content) return;
		if (oldMessage.author.bot) return;

		const logsChannel = await client.extras.getLogs(oldMessage.guildId);
		if (!logsChannel) return;

		client.extras
			.embed(
				{
					title: `Message updated`,
					desc: `A message has been updated`,
					fields: [
						{
							name: `→ Author`,
							value: `${newMessage.member.user} (${newMessage.member.user?.tag})`,
						},
						{
							name: `→ Date`,
							value: `${newMessage.createdAt}`,
						},
						{
							name: `→ Channel`,
							value: `${newMessage.channel} (${newMessage.channel.name})`,
						},
						{
							name: `→ Old message`,
							value: `\`\`\`${oldMessage.content.replace(/`/g, "'")}\`\`\``,
						},
						{
							name: `→ New message`,
							value: `\`\`\`${newMessage.content.replace(/`/g, "'")}\`\`\``,
						},
					],
				},
				logsChannel,
			)
			.catch();
	} catch {
		//Fix lint
	}
};
