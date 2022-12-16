import { AeonaBot } from '../../extras/index.js';
import { Guild, Member, Message } from 'discordeno';

export default async (client: AeonaBot) => {
	client.on('messageCreate', async (bot: AeonaBot, message: Message) => {
		if (message.isFromBot) return;

		client.emit('messageCreateNoBots', bot, message);
	});
	client.on('guildMemberUpdateWithOldMember', (client: AeonaBot, oldMember: Member, newMember: Member) => {
		if (!oldMember.premiumSince && newMember.premiumSince) {
			client.emit('guildMemberBoost', client, newMember);
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			client.emit('guildMemberUnboost', client, newMember);
		}
	});

	client.on('guildUpdateWithOldGuild', (client: AeonaBot, oldGuild: Guild, newGuild: Guild) => {
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
