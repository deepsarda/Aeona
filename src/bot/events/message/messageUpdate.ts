import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
export default async (client: AmethystBot, oldMessage: Message, newMessage: Message) => {
	try {
		if (!oldMessage.content || !newMessage.content) return;
		if (oldMessage.content === newMessage.content) return;
		if (oldMessage.member?.user?.toggles.bot) return;

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
							value: `<@${newMessage.member?.id}> (${
								newMessage.member?.user?.username + '#' + newMessage.member?.user?.discriminator
							})`,
						},
						{
							name: `→ Date`,
							value: `${new Date(newMessage.timestamp).toUTCString()}`,
						},
						{
							name: `→ Channel`,
							value: `<#${newMessage.channelId}> `,
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
		//catch lint error
	}
};
