import { AeonaBot } from '../../extras/index.js';
import { Message } from 'discordeno/transformers';

export default async (client: AeonaBot, messageDeleted: Message) => {
	if (!messageDeleted) return;
	if (messageDeleted.member?.user?.toggles.bot) return;

	let content = messageDeleted.content;
	if (!content) content = 'No text to be found';
	if (!messageDeleted.attachments) return;
	if (messageDeleted.attachments.length > 0) content = messageDeleted.attachments[0]?.url;

	const logsChannel = await client.extras.getLogs(messageDeleted.guildId);
	if (!logsChannel) return;

	client.extras
		.embed(
			{
				title: `Message deleted`,
				desc: `A message has been deleted`,
				fields: [
					{
						name: `→ Author`,
						value: `<@${messageDeleted.authorId}>`,
					},
					{
						name: `→ Date`,
						value: `${new Date(messageDeleted.timestamp).toUTCString()}`,
					},
					{
						name: `→ Channel`,
						value: `<#${messageDeleted.channelId}>`,
					},
					{
						name: `→ Message`,
						value: `\`\`\`${content.replace(/`/g, "'")}\`\`\``,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
