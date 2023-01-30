import { DiscordReaction, DiscordReactions, DiscordSystemMessage } from '@derockdev/discord-components-react';
import { Errors, Guild, Member, Message, MessageTypes, Role, User } from 'discordeno';
import React from 'react';

import { AeonaBot } from '../../../extras/index.js';
import { parseDiscordEmoji } from '../../utils/utils.js';

export default async function renderSystemMessage(
  bot: AeonaBot,
  message: Message,
) {
  switch (message.type) {
    case MessageTypes.RecipientAdd:
    case MessageTypes.UserJoin:
      return (
        <DiscordSystemMessage
          id={`m-${message.id}`}
          key={`${message.id}`}
          type='join'
        >
          {await JoinMessage(
            bot,
            message.member,
            (await bot.cache.users.get(message.authorId))!,
          )}
        </DiscordSystemMessage>
      );

    case MessageTypes.ChannelPinnedMessage:
      return (
        <DiscordSystemMessage
          id={`m-${message.id}`}
          key={`${message.id}`}
          type='pin'
        >
          <Highlight
            color={rgbToHex(
              (
                await highestRole(
                  bot,
                  message.member?.guildId ? message.member.guildId : BigInt(0),
                  message.member!,
                )
              ).color,
            )}
          >
            {message.member?.user?.username}
          </Highlight>{' '}
          pinned{' '}
          <i data-goto={message.messageReference?.messageId}>a message</i> to
          this channel.
          {/* reactions */}
          {message.reactions!.length > 0 && (
            <DiscordReactions slot='reactions'>
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
        </DiscordSystemMessage>
      );

    case MessageTypes.GuildBoost:
    case MessageTypes.GuildBoostTier1:
    case MessageTypes.GuildBoostTier2:
    case MessageTypes.GuildBoostTier3:
      return (
        <DiscordSystemMessage
          id={`m-${message.id}`}
          key={`${message.id}`}
          type='boost'
        >
          <Highlight
            color={rgbToHex(
              (
                await highestRole(
                  bot,
                  message.member?.guildId ? message.member.guildId : BigInt(0),
                  message.member!,
                )
              ).color,
            )}
          >
            {message.member?.user?.username}
          </Highlight>{' '}
          boosted the server!
        </DiscordSystemMessage>
      );

    case MessageTypes.ThreadStarterMessage:
      return (
        <DiscordSystemMessage
          id={`ms-${message.id}`}
          key={`${message.id}`}
          type='thread'
        >
          <Highlight
            color={rgbToHex(
              (
                await highestRole(
                  bot,
                  message.member?.guildId ? message.member.guildId : BigInt(0),
                  message.member!,
                )
              ).color,
            )}
          >
            {message.member?.user?.username}
          </Highlight>{' '}
          started a thread:{' '}
          <i data-goto={message.messageReference?.messageId}>
            {message.content}
          </i>
        </DiscordSystemMessage>
      );

    default:
      return undefined;
  }
}

export function Highlight({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <i style={{ color: color ?? 'white' }}>{children}</i>;
}

const allJoinMessages = [
  '{user} just joined the server - glhf!',
  '{user} just joined. Everyone, look busy!',
  '{user} just joined. Can I get a heal?',
  '{user} joined your party.',
  '{user} joined. You must construct additional pylons.',
  'Ermagherd. {user} is here.',
  'Welcome, {user}. Stay awhile and listen.',
  'Welcome, {user}. We were expecting you ( ͡° ͜ʖ ͡°)',
  'Welcome, {user}. We hope you brought pizza.',
  'Welcome {user}. Leave your weapons by the door.',
  'A wild {user} appeared.',
  'Swoooosh. {user} just landed.',
  'Brace yourselves {user} just joined the server.',
  '{user} just joined. Hide your bananas.',
  '{user} just arrived. Seems OP - please nerf.',
  '{user} just slid into the server.',
  'A {user} has spawned in the server.',
  'Big {user} showed up!',
  "Where's {user}? In the server!",
  '{user} hopped into the server. Kangaroo!!',
  '{user} just showed up. Hold my beer.',
  'Challenger approaching - {user} has appeared!',
  "It's a bird! It's a plane! Nevermind, it's just {user}.",
  "It's {user}! Praise the sun! \\\\[T]/",
  'Never gonna give {user} up. Never gonna let {user} down.',
  'Ha! {user} has joined! You activated my trap card!',
  'Cheers, love! {user} is here!',
  'Hey! Listen! {user} has joined!',
  "We've been expecting you {user}",
  "It's dangerous to go alone, take {user}!",
  "{user} has joined the server! It's super effective!",
  'Cheers, love! {user} is here!',
  '{user} is here, as the prophecy foretold.',
  "{user} has arrived. Party's over.",
  'Ready player {user}',
  '{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.',
  "Hello. Is it {user} you're looking for?",
];

export async function JoinMessage(
  bot: AeonaBot,
  member: Member | undefined,
  fallbackUser: User,
): Promise<string> {
  const randomMessage =
    allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)]!;

  randomMessage.replace(
    '{user}',
    `<Highlight
    color={${rgbToHex(
      (
        await highestRole(
          bot,
          member?.guildId ? member.guildId : BigInt(0),
          member!,
        )
      ).color,
    )}}
  >
    {${member?.nick ?? fallbackUser.username}}
  </Highlight>`,
  );

  return randomMessage;
}

function rgbToHex(rgb: number) {
  let hex = rgb.toString(16);
  if (hex.length < 2) {
    hex = `0${hex}`;
  }
  return `#${hex}`;
}
export async function highestRole(
  bot: AeonaBot,
  guildOrId: bigint | Guild,
  memberOrId: bigint | Member,
) {
  const guild =
    typeof guildOrId === 'bigint'
      ? await bot.cache.guilds.get(guildOrId)
      : guildOrId;
  if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);

  // Get the roles from the member
  const memberRoles = (
    typeof memberOrId === 'bigint'
      ? await bot.cache.members.get(memberOrId, guild.id)
      : memberOrId
  )?.roles;
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
