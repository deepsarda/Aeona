import { AeonaBot } from '../../extras/index.js';
import { Channel, Guild, Member, Role, User } from 'discordeno';
export default async (client: AeonaBot) => {
	client.on('guildMemberAdd', async (client: AeonaBot, member: Member) => {
		if (!member.guildId) return;
		client.emit('updateMembers', client, await client.helpers.getGuild(member.guildId));
		client.emit('updateBots', client, await client.helpers.getGuild(member.guildId));
	});
	client.on('memberDelete', async (client: AeonaBot, user: User, guildId: bigint) => {
		client.emit('updateMembers', client, await client.helpers.getGuild(guildId));
		client.emit('updateBots', client, await client.helpers.getGuild(guildId));
	});

	client.on('channelCreate', async (client: AeonaBot, channel: Channel) => {
		if (!channel.guildId) return;
		client.emit('updateChannels', channel, client, await client.helpers.getGuild(channel.guildId));
		client.emit('updateNewsChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateStageChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateTextChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateVoiceChannels', client, channel, await client.helpers.getGuild(channel.guildId));
	});

	client.on('channelDelete', async (client: AeonaBot, channel: Channel) => {
		if (!channel.guildId) return;
		client.emit('updateChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateNewsChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateStageChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateTextChannels', client, channel, await client.helpers.getGuild(channel.guildId));
		client.emit('updateVoiceChannels', client, channel, await client.helpers.getGuild(channel.guildId));
	});

	client.on('roleCreate', async (client: AeonaBot, role: Role) =>
		client.emit('updateRoles', client, await client.helpers.getGuild(role.guildId)),
	);

	client.on('roleDeleteWithOldRole', async (client: AeonaBot, role: Role) =>
		client.emit('updateRoles', client, await client.helpers.getGuild(role.guildId)),
	);

	client.on('guildMemberBoost', async (booster: Member) =>
		client.emit('updateBoosts', client, await client.helpers.getGuild(booster.guildId)),
	);
	client.on('guildMemberUnboost', async (booster: Member) =>
		client.emit('updateBoosts', client, await client.helpers.getGuild(booster.guildId)),
	);

	client.on('guildBoostLevelUp', async (tier: Guild) => client.emit('updateTier', client, tier));
	client.on('guildBoostLevelDown', async (tier: Guild) => client.emit('updateTier', client, tier));

	client.on('emojiCreate', async (emoji) => {
		client.emit('updateEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
		client.emit('updateAEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
		client.emit('updateSEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
	});
	client.on('emojiDelete', async (emoji) => {
		client.emit('updateEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
		client.emit('updateAEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
		client.emit('updateSEmojis', client, emoji, await client.helpers.getGuild(emoji.guildId));
	});

	
};
