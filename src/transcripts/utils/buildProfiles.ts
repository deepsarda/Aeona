import { AmethystCollection } from '@thereallonewolf/amethystframework';
import { BigString, Member, Message, User, avatarUrl } from '@discordeno/bot';

import { AeonaBot } from '../../extras/index.js';

export type Profile = {
  author: string; // author of the message
  avatar?: string; // avatar of the author
  roleColor?: string; // role color of the author
  roleIcon?: string; // role color of the author
  roleName?: string; // role name of the author

  bot?: boolean; // is the author a bot
  verified?: boolean; // is the author verified
};

export async function buildProfiles(bot: AeonaBot, messages: Message[]) {
  const profiles = new AmethystCollection<BigString, CustomUser>();

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = await bot.cache.users.get(message.author.id);
    if (!profiles.has(author.id)) {
      // add profile
      profiles.set(`${author.id}`, await buildProfile(bot, message.member!, author));
    }

    // add interaction users
    if (message.interaction) {
      if (!profiles.has(author.id)) {
        profiles.set(`${author.id}`, await buildProfile(bot, null, author));
      }
    }

    // threads
    if (message.thread && message.thread.lastMessageId) {
      const m = await bot.helpers.getMessage(`${message.thread.id}`, message.thread.lastMessageId);
      profiles.set(m.author.id, await buildProfile(bot, m.member!, await bot.helpers.getUser(m.author.id)));
    }
  }

  // return as a JSON
  return JSON.stringify(profiles);
}

async function buildProfile(bot: AeonaBot, member: Member | null, author: User): Promise<CustomUser> {
  const u: CustomUser = {
    author: member?.nick ?? author.username,
    avatar: avatarUrl(`${author.id}`, author.discriminator, {
      avatar: member ? member.avatar : author.avatar,
      size: 64,
    }),
    bot: author.toggles.bot,
    verified: false,
  };

  return u;
}

type CustomUser = {
  author: string;
  avatar: string;
  roleColor?: string;
  roleIcon?: string;
  bot: boolean;
  verified: boolean;
};
