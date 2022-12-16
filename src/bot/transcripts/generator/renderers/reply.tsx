import { DiscordReply } from '@derockdev/discord-components-react';
import { AeonaBot } from '../../../extras/index.js';
import { ChannelTypes, Errors, Guild, Member, Message, Role } from 'discordeno';
import React from 'react';
import type { RenderMessageContext } from '..';
import renderContent, { RenderType } from './content.js';
export default async function renderReply(bot: AeonaBot, message: Message, context: RenderMessageContext) {
	if (!message.messageReference) return null;
	if (message.messageReference.guildId !== message.guildId) return null;

	const referencedMessage = context.messages.find((m) => m.id === message.messageReference!.messageId);

	if (!referencedMessage) return <DiscordReply slot="reply">Message could not be loaded.</DiscordReply>;

	const isCrosspost =
		referencedMessage.messageReference && referencedMessage.messageReference.guildId !== message.guildId;
	const isCommand = referencedMessage.interaction !== null;
	const user = await bot.cache.users.get(referencedMessage.authorId);
	return (
		<DiscordReply
			slot="reply"
			edited={!isCommand && referencedMessage.editedTimestamp !== null}
			attachment={referencedMessage.attachments.length > 0}
			author={referencedMessage.member?.nick ?? referencedMessage.member?.user?.username}
			avatar={bot.helpers.getAvatarURL(referencedMessage.authorId, user ? user.discriminator : '', {
				avatar: referencedMessage.member?.avatar + '',
			})}
			roleColor={rgbToHex((await highestRole(bot, referencedMessage.guildId!, referencedMessage.member!)).color)}
			bot={!isCrosspost && referencedMessage.member?.user?.toggles.bot}
			verified={false}
			op={
				(await bot.cache.channels.get(message.channelId))!.type == ChannelTypes.DM &&
				referencedMessage.authorId === (await bot.cache.channels.get(message.channelId))!.ownerId
			}
			server={isCrosspost ?? undefined}
			command={isCommand}
		>
			{referencedMessage.content ? (
				<span data-goto={referencedMessage.id}>
					{await renderContent(referencedMessage.content, {
						...context,
						type: RenderType.REPLY,
					})}
				</span>
			) : isCommand ? (
				<em data-goto={referencedMessage.id}>Click to see command.</em>
			) : (
				<em data-goto={referencedMessage.id}>Click to see attachment.</em>
			)}
		</DiscordReply>
	);
}
function rgbToHex(rgb: number) {
	let hex = rgb.toString(16);
	if (hex.length < 2) {
		hex = '0' + hex;
	}
	return '#' + hex;
}
export async function highestRole(bot: AeonaBot, guildOrId: bigint | Guild, memberOrId: bigint | Member) {
	const guild = typeof guildOrId === 'bigint' ? await bot.cache.guilds.get(guildOrId) : guildOrId;
	if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);

	// Get the roles from the member
	const memberRoles = (typeof memberOrId === 'bigint' ? await bot.cache.members.get(memberOrId, guild.id) : memberOrId)
		?.roles;
	// This member has no roles so the highest one is the @everyone role
	if (!memberRoles) return guild.roles.get(guild.id)!;

	let memberHighestRole: Role | undefined;

	for (const roleId of memberRoles) {
		const role = guild.roles.get(roleId);
		// Rare edge case handling if undefined
		if (!role) continue;

		// If memberHighestRole is still undefined we want to assign the role,
		// else we want to check if the current role position is higher than the current memberHighestRole
		if (
			!memberHighestRole ||
			memberHighestRole.position < role.position ||
			memberHighestRole.position === role.position
		) {
			memberHighestRole = role;
		}
	}

	// The member has at least one role so memberHighestRole must exist
	return memberHighestRole!;
}
