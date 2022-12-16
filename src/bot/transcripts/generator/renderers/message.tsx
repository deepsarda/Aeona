import {
	DiscordAttachments,
	DiscordCommand,
	DiscordMessage,
	DiscordReaction,
	DiscordReactions,
	DiscordThread,
	DiscordThreadMessage,
} from '@derockdev/discord-components-react';
import { AeonaBot } from '../../../extras/index.js';
import { Message, MessageTypes } from 'discordeno';
import React from 'react';
import type { RenderMessageContext } from '..';
import { parseDiscordEmoji } from '../../utils/utils.js';
import renderAttachments from './attachment.js';
import renderComponentRow from './components.js';
import renderContent, { RenderType } from './content.js';
import { renderEmbed } from './embed.js';
import renderReply from './reply.js';
import renderSystemMessage from './systemMessage.js';

export default async function renderMessage(bot: AeonaBot, message: Message, context: RenderMessageContext) {
	if (
		message.type == MessageTypes.ChannelFollowAdd ||
		message.type == MessageTypes.Call ||
		message.type == MessageTypes.ChannelPinnedMessage ||
		message.type == MessageTypes.GuildBoost ||
		message.type == MessageTypes.GuildBoostTier1 ||
		message.type == MessageTypes.GuildBoostTier2 ||
		message.type == MessageTypes.GuildBoostTier3 ||
		message.type == MessageTypes.UserJoin
	)
		return renderSystemMessage(bot, message);

	const isCrosspost = message.messageReference && message.messageReference.guildId !== message.guildId;

	return (
		<DiscordMessage
			id={`m-${message.id}`}
			timestamp={new Date(message.timestamp)}
			key={message.id + ''}
			edited={message.editedTimestamp !== null}
			server={isCrosspost ?? undefined}
			profile={message.authorId + ''}
		>
			{/* reply */}
			{await renderReply(bot, message, context)}

			{/* slash command */}
			{message.interaction && (
				<DiscordCommand
					slot="reply"
					profile={message.interaction.user.id + ''}
					command={'/' + message.interaction.name}
				/>
			)}

			{/* message content */}
			{message.content &&
				(await renderContent(message.content, {
					...context,
					type: message.webhookId ? RenderType.WEBHOOK : RenderType.NORMAL,
				}))}

			{/* attachments */}
			{await renderAttachments(message, context)}

			{/* message embeds */}
			{message.embeds &&
				message.embeds.length > 0 &&
				(await Promise.all(
					message.embeds.map(async (embed, id) => await renderEmbed(embed, { ...context, index: id, message })),
				))}

			{/* components */}
			{message.components && message.components.length > 0 && (
				<DiscordAttachments slot="components">
					{message.components!.map((component, id) =>
						//@ts-ignore
						renderComponentRow(component, id),
					)}
				</DiscordAttachments>
			)}

			{/* reactions */}
			{message.reactions && message.reactions.length > 0 && (
				<DiscordReactions slot="reactions">
					{message.reactions!.map((reaction) => (
						<DiscordReaction
							key={`${message.id}r${reaction.emoji.id}`}
							name={reaction.emoji.name!}
							emoji={parseDiscordEmoji(reaction.emoji)}
							count={reaction.count}
						/>
					))}
				</DiscordReactions>
			)}

			{/* threads */}
			{message.thread && (
				<DiscordThread
					slot="thread"
					name={message.thread.name}
					cta={
						message.thread.messageCount
							? `${message.thread.messageCount} Message${message.thread.messageCount > 1 ? 's' : ''}`
							: 'View Thread'
					}
				>
					{message.thread.lastMessageId ? (
						<DiscordThreadMessage profile={(await bot.cache.messages.get(message.thread.lastMessageId))?.id + ''}>
							{await renderContent(
								(await bot.cache.messages.get(message.thread.lastMessageId))!.content.length > 128
									? (await bot.cache.messages.get(message.thread.lastMessageId))!.content.substring(0, 125) + '...'
									: (await bot.cache.messages.get(message.thread.lastMessageId))!.content,
								{ ...context, type: RenderType.REPLY },
							)}
						</DiscordThreadMessage>
					) : (
						`Thread messages not saved.`
					)}
				</DiscordThread>
			)}
		</DiscordMessage>
	);
}
