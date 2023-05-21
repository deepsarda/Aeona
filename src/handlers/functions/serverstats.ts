import { Channel, Guild, Member, Role, User } from '@discordeno/bot';

import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot) => {
  client.on('guildMemberAdd', async (client: AeonaBot, member: Member) => {
    if (!member.guildId) return;
    client.emit('updateMembers', client, await client.cache.guilds.get(member.guildId));
    client.emit('updateBots', client, await client.cache.guilds.get(member.guildId));
  });
  client.on('memberDelete', async (client: AeonaBot, user: User, guildId: bigint) => {
    client.emit('updateMembers', client, await client.cache.guilds.get(guildId));
    client.emit('updateBots', client, await client.cache.guilds.get(guildId));
  });

  client.on('channelCreate', async (client: AeonaBot, channel: Channel) => {
    if (!channel.guildId) return;
    client.emit('updateChannels', channel, client, await client.cache.guilds.get(channel.guildId));
    client.emit('updateNewsChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateStageChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateTextChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateVoiceChannels', client, channel, await client.cache.guilds.get(channel.guildId));
  });

  client.on('channelDelete', async (client: AeonaBot, channel: Channel) => {
    if (!channel.guildId) return;
    client.emit('updateChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateNewsChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateStageChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateTextChannels', client, channel, await client.cache.guilds.get(channel.guildId));
    client.emit('updateVoiceChannels', client, channel, await client.cache.guilds.get(channel.guildId));
  });

  client.on('roleCreate', async (client: AeonaBot, role: Role) =>
    client.emit('updateRoles', client, await client.cache.guilds.get(role.guildId)),
  );

  client.on(
    'roleDelete',
    async (
      client: AeonaBot,
      role: {
        guildId: bigint;
        roleId: bigint;
      },
    ) => client.emit('updateRoles', client, await client.cache.guilds.get(role.guildId)),
  );

  client.on('guildMemberBoost', async (client: AeonaBot, booster: Member) =>
    client.emit('updateBoosts', client, await client.cache.guilds.get(booster.guildId)),
  );
  client.on('guildMemberUnboost', async (client: AeonaBot, booster: Member) =>
    client.emit('updateBoosts', client, await client.cache.guilds.get(booster.guildId)),
  );

  client.on('guildBoostLevelUp', async (client: AeonaBot, tier: Guild) => client.emit('updateTier', client, tier));
  client.on('guildBoostLevelDown', async (client: AeonaBot, tier: Guild) => client.emit('updateTier', client, tier));

  client.on('emojiCreate', async (client: AeonaBot, emoji) => {
    client.emit('updateEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
    client.emit('updateAEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
    client.emit('updateSEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
  });
  client.on('emojiDelete', async (client: AeonaBot, emoji) => {
    client.emit('updateEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
    client.emit('updateAEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
    client.emit('updateSEmojis', client, emoji, await client.cache.guilds.get(emoji.guildId));
  });
};
