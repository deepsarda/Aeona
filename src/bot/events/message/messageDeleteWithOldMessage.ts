import { Message } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

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
						name: `<:members:1063116392762712116> Author`,
						value: `<@${messageDeleted.authorId}>`,
					},
					{
						name: `🕒 Date`,
						value: `${new Date(messageDeleted.timestamp).toUTCString()}`,
					},
					{
						name: `<:channel:1049292166343688192> Channel`,
						value: `<#${messageDeleted.channelId}>`,
					},
					{
						name: `💬 Message`,
						value: `\`\`\`${content.replace(/`/g, "'")}\`\`\``,
					},
				],
			},
			logsChannel,
		)
		.catch();
};
