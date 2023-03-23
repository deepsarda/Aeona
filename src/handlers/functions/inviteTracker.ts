import { Invite, Member } from "discordeno/transformers";
import { AeonaBot } from "../../extras/index.js";

export default async (client: AeonaBot) => {
  const guildInvites = new Map();

  client.on("inviteCreate", async (client: AeonaBot, invite: Invite) => {
    try {
      if (!invite.guildId) return;
      const invites = await client.helpers.getInvites(invite.guildId!);

      const codeUses = new Map();
      invites.forEach((inv) => codeUses.set(inv.code, inv.uses));

      guildInvites.set(invite.guildId, codeUses);
    } catch {
      // this pervents a lint error
    }
  });

  client.on("guildMemberAdd", async (bot: AeonaBot, member: Member) => {
    try {
      const cachedInvites = guildInvites.get(member.guildId);
      if (!member.guildId) return;
      const newInvites = await client.helpers.getInvites(member.guildId);
      guildInvites.set(member.guildId, newInvites);

      const usedInvite = newInvites.find(
        (inv) => cachedInvites.get(inv.code).uses < inv.uses
      );
      if (!usedInvite)
        return client.emit("inviteJoin", client, member, null, null);

      client.emit("inviteJoin", client, member, usedInvite, usedInvite.inviter);
    } catch (err) {
      return client.emit("inviteJoin", client, member, null, null);
    }
  });
};
