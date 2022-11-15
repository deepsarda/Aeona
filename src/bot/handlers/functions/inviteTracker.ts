import { AmethystBot } from '@thereallonewolf/amethystframework/';
import { Invite, Member } from 'discordeno/transformers';
export default async (client: AmethystBot) => {
	const guildInvites = new Map();

	client.on('inviteCreate', async (client: AmethystBot, invite: Invite) => {
		try {
			const invites = await client.helpers.getInvites(invite.guildId!);

			const codeUses = new Map();
			invites.forEach((inv) => codeUses.set(inv.code, inv.uses));

			guildInvites.set(invite.guildId, codeUses);
		} catch {
			//this pervents a lint error
		}
	});
/*
	client.once('ready', async () => {
		try {
			setInterval(async function () {
				const Guilds = client.cache.guilds.memory.map((guild) => guild.id);
				let i = 0;
				const interval = setInterval(async function () {
					try {
						const invites = await client.helpers.getInvites(Guilds[i]!);

						const codeUses = new Map();
						Array.from(invites).forEach((i) => {
							codeUses.set(i[1].code, i[1].uses);
						});
						guildInvites.set(Guilds[i], codeUses);

						i++;

						if (i === Guilds.length) clearInterval(interval);
					} catch {
						//lint
					}
				}, 1500);
			}, 60  * 60 * 1000);
		} catch (e) {
			//this pervents a lint error
		}
	});
*/
	client.on('guildMemberAdd', async (member: Member) => {
		try {
			const cachedInvites = guildInvites.get(member.guildId);
			const newInvites = await client.helpers.getInvites(member.guildId);
			guildInvites.set(member.guildId, newInvites);

			const usedInvite = newInvites.find((inv) => cachedInvites.get(inv.code).uses < inv.uses);
			if (!usedInvite) return client.emit('inviteJoin', client, member, null, null);

			client.emit('inviteJoin', client, member, usedInvite, usedInvite.inviter);
		} catch (err) {
			return client.emit('inviteJoin', client, member, null, null);
		}
	});
};
