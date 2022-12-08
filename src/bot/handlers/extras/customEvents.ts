import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Guild, Member, Message } from 'discordeno';
import Schema from '../../database/models/logChannels.js';

export default async (client: AmethystBot) => {
	client.extras.getLogs = async function (guildId: any) {
		const data = await Schema.findOne({ Guild: guildId });
		if (data && data.Channel) {
			const channel = await client.helpers.getChannel(BigInt(data.Channel));
			return channel;
		} else {
			return false;
		}
	};
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		if (message.isFromBot) return;

		client.emit('messageCreateNoBots', bot, message);
	});
	client.on('guildMemberUpdateWithOldMember', (client: AmethystBot, oldMember: Member, newMember: Member) => {
		if (!oldMember.premiumSince && newMember.premiumSince) {
			client.emit('guildMemberBoost', client, newMember);
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			client.emit('guildMemberUnboost', client, newMember);
		}
	});

	client.on('guildUpdateWithOldGuild', (client: AmethystBot, oldGuild: Guild, newGuild: Guild) => {
		if (oldGuild.premiumTier < newGuild.premiumTier) {
			client.emit('guildBoostLevelUp', client, newGuild, oldGuild.premiumTier, newGuild.premiumTier);
		}

		if (oldGuild.premiumTier > newGuild.premiumTier) {
			client.emit('guildBoostLevelDown', client, newGuild, oldGuild.premiumTier, newGuild.premiumTier);
		}

		if (!oldGuild.banner && newGuild.banner) {
			client.emit(
				'guildBannerAdd',
				client,
				newGuild,
				client.helpers.getGuildBannerURL(newGuild.id + '', {
					banner: newGuild.banner,
				}),
			);
		}

		if (!oldGuild.afkChannelId && newGuild.afkChannelId) {
			client.emit('guildAfkChannelAdd', client, newGuild, newGuild.afkChannelId);
		}

		if (!oldGuild.vanityUrlCode && newGuild.vanityUrlCode) {
			client.emit('guildVanityURLAdd', client, newGuild, newGuild.vanityUrlCode);
		}

		if (oldGuild.vanityUrlCode && !newGuild.vanityUrlCode) {
			client.emit('guildVanityURLRemove', client, newGuild, oldGuild.vanityUrlCode);
		}

		if (oldGuild.vanityUrlCode !== newGuild.vanityUrlCode) {
			client.emit('guildVanityURLUpdate', client, newGuild, oldGuild.vanityUrlCode, newGuild.vanityUrlCode);
		}
	});

	client.on('guildRoleUpdateWithOldRole', () => {
		//aaa
	});
	client.on('channelUpdateWithOldChannel', () => {
		//aaa
	});
};
