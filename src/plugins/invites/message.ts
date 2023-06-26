import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import {
  Bot,
  Guard,
  SimpleCommandMessage,
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  On,
  ArgsOf,
} from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { Guild, GuildMember, InviteGuild, Role, User } from 'discord.js';
import Schema from '../../database/models/invites.js';
import SchemaRewards from '../../database/models/inviteRewards.js';
import invitedBy from '../../database/models/inviteBy.js';
import { AeonaBot } from '../../utils/types.js';
import inviteRewards from '../../database/models/inviteRewards.js';

const guildInvites = new Map();

@Discord()
@Bot(...getPluginsBot('invites'))
@Category('invites')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Invites {
  @SimpleCommand({
    name: 'invites add',
    description: 'add invites to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async add(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to add invites to',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of invites you want to add',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+invites add <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user?.id}`,
    });
    if (data) {
      data.Invites! += amount;
      data.Total! += amount;
      data.save();
    } else {
      data = new Schema({
        Guild: ctx.guild!.id,
        User: `${user?.id}`,
        Invites: amount,
        Total: amount,
        Left: 0,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Added **${amount}** invites to <@${user.id}>`,
        fields: [
          {
            name: '📨 Total invites',
            value: `${data!.Invites}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'invites remove',
    description: 'remove invites from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async remove(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to remove invites from',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of invites you want to remove',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+invites remove <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user?.id}`,
    });

    if (data) {
      data.Invites! -= amount;
      data.Total! -= amount;
      data.save();
    } else {
      data = new Schema({
        Guild: ctx.guild!.id,
        User: `${user?.id}`,
        Invites: amount,
        Total: amount,
        Left: 0,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Removed **${amount}** invites from <@${user.id}>`,
        fields: [
          {
            name: '📨 Total invites',
            value: `${data!.Invites}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'invites createreward',
    description: 'Award a role for reaching a certain amount of invites. 🎉',
  })
  @Guard(PermissionGuard(['ManageRoles']))
  async createreward(
    @SimpleCommandOption({
      name: 'role',
      description: 'The role you want to award',
      type: SimpleCommandOptionType.Role,
    })
    role: Role | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'How many invites',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,

    command: SimpleCommandMessage,
  ) {
    if (!amount || !role)
      return bot.extras.errUsage(
        {
          usage: `+invites createreward <role> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.findOne({
      Guild: ctx.guild!.id,
      Invites: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: ctx.guild!.id,
        Invites: amount,
        Role: role.id,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Invite reward created. I shall now give <@&${role.id}> to members on reaching **${amount}** invites`,
        fields: [
          {
            name: '<:role:1062978537436491776> Role',
            value: `<@&${role.id}>`,
            inline: true,
          },
          {
            name: '📈 Invites Amount',
            value: `${amount}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'invites removereward',
    description: 'remove a reward from my memory ❌',
  })
  @Guard(PermissionGuard(['ManageRoles']))
  async removereward(
    @SimpleCommandOption({
      name: 'amount',
      description: 'How many invites',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount)
      return bot.extras.errUsage(
        {
          usage: `+invites removereward <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.deleteOne({
      Guild: ctx.guild!.id,
      Invites: amount,
    });

    bot.extras.succNormal(
      {
        text: `Invite reward removed for ${amount} invites. I shall no longer give the members a role for reaching that amount of invites.`,

        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'invites leaderboard',
    description: 'show the leaderboard for invites 🥇',
  })
  async leaderboard(command: SimpleCommandMessage) {
    let ctx = command.message;

    const rawLeaderboard = await Schema.find({
      Guild: ctx.guild!.id,
    }).sort([['Invites', 'descending']]);

    if (!rawLeaderboard)
      return bot.extras.errNormal(
        {
          error: `No data found`,
        },
        command,
      );

    const lb = rawLeaderboard.map(
      (e) =>
        `**${rawLeaderboard.findIndex((i) => i.Guild === `${ctx.guild!.id}` && i.User === e.User) + 1}** | <@!${
          e.User
        }> - Invites: \`${e.Invites}\``,
    );

    await bot.extras.createLeaderboard(`Invites - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'invites show',
    description: 'show the invites of a user 🥇',
  })
  async show(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to show invites from',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) user = ctx.author;

    if (user instanceof GuildMember) user = user.user;

    let data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user.id}`,
    });

    if (data) {
      bot.extras.embed(
        {
          title: 'Invites',
          desc: `**${`${user.tag}`}** has \`${data.Invites}\` invites`,
          fields: [
            {
              name: 'Total',
              value: `${data.Total}`,
              inline: true,
            },
            {
              name: 'Left',
              value: `${data.Left}`,
              inline: true,
            },
          ],
          type: 'reply',
        },
        command,
      );
    } else {
      bot.extras.embed(
        {
          title: 'Invites',
          desc: `**${`${user.tag}`}** has \`0\` invites`,
          fields: [
            {
              name: 'Total',
              value: `0`,
              inline: true,
            },
            {
              name: 'Left',
              value: `0`,
              inline: true,
            },
          ],
          type: 'reply',
        },
        command,
      );
    }
  }

  @SimpleCommand({
    name: 'invites rewards',
    description: 'show the invites rewards setup 🎁',
  })
  async rewards(command: SimpleCommandMessage) {
    let ctx = command.message;

    const rawLeaderboard = await SchemaRewards.find({
      Guild: ctx.guild!.id,
    });

    if (rawLeaderboard.length < 1)
      return bot.extras.errNormal(
        {
          error: `No rewards found!`,
          type: 'reply',
        },
        command,
      );

    const lb = rawLeaderboard.map((e) => `**${e.Invites} invites** - <@&${e.Role}>`);

    await bot.extras.createLeaderboard(`Invite rewards - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'invites reset',
    description: 'reset all the invites and invites rewards for this server :negative_squared_cross_mark:',
  })
  @Guard(PermissionGuard(['ManageGuild']))
  async reset(command: SimpleCommandMessage) {
    let ctx = command.message;

    const deletedUsers = await Schema.deleteMany({
      Guild: ctx.guild!.id,
    });

    const deletedRewards = await SchemaRewards.deleteMany({
      Guild: ctx.guild!.id,
    });

    bot.extras.succNormal(
      {
        text: `🗑️ Deleted **${deletedUsers.deletedCount} users**.
🗑️ Deleted **${deletedRewards.deletedCount} rewards**`,
        type: 'reply',
      },
      command,
    );
  }

  @On()
  async guildMemberRemove([member]: ArgsOf<'guildMemberRemove'>, client: AeonaBot) {
    const inviteByData = await invitedBy.findOne({
      Guild: `${member.guild.id}`,
      User: `${member.user.id}`,
    });

    if (inviteByData) {
      const inviteData = await Schema.findOne({
        Guild: `${member.guild.id}`,
        User: inviteByData.inviteUser,
      });

      if (inviteData && inviteData.Invites && inviteData.Left) {
        inviteData.Invites -= 1;
        inviteData.Left += 1;
        inviteData.save();
      }
    }
  }

  @On()
  async inviteCreate([invite]: ArgsOf<'inviteCreate'>, client: AeonaBot) {
    try {
      if (!invite.guild) return;
      let guild: Guild;
      if (invite instanceof InviteGuild) guild = await invite.guild.fetch();
      else guild = invite.guild as unknown as Guild;
      const invites = await guild.invites.fetch();

      const codeUses = new Map();
      invites.each((inv) => codeUses.set(inv.code, inv.uses));

      guildInvites.set(invite.guild.id, codeUses);
    } catch {
      // this pervents a lint error
    }
  }

  @On()
  async ready(client: AeonaBot) {
    try {
      const guilds = client.guilds.cache.map((guild) => guild.id);
      let i = 0;
      let interval = setInterval(async function () {
        const guild = await client.guilds.fetch(guilds[i]).catch(() => {});
        if (!guild || !guild.invites) return i++;

        guild.invites
          .fetch()
          .then((rawGuildInvites) => {
            const codeUses = new Map();
            Array.from(rawGuildInvites).forEach((i) => {
              codeUses.set(i[1].code, i[1].uses);
            });
            guildInvites.set(guild.id, codeUses);
          })
          .catch(() => {});
        i++;

        if (i === guilds.length) clearInterval(interval);
      }, 1500);
    } catch (e) {}
  }

  @On()
  async guildMemberAdd([member]: ArgsOf<'guildMemberAdd'>, client: AeonaBot) {
    try {
      const cachedInvites = guildInvites.get(member.guild.id);
      const newInvites = await member.guild.invites.fetch();
      guildInvites.set(member.guild.id, newInvites);

      const usedInvite = newInvites.find((inv) => cachedInvites.get(inv.code).uses < (inv.uses == null ? 0 : inv.uses));

      if (usedInvite && usedInvite.inviter) {
        let data = await Schema.findOne({
          Guild: usedInvite.guild!.id,
          User: `${usedInvite.inviter.id}`,
        });

        if (data) {
          if (!data.Invites) data.Invites = 0;
          if (!data.Total) data.Total = 0;
          data.Invites += 1;
          data.Total += 1;
          data.save();
        } else {
          data = await new Schema({
            Guild: usedInvite.guild!.id,
            User: `${usedInvite.inviter.id}`,
            Invites: 1,
            Total: 1,
            Left: 0,
          });
          data.save();
        }

        const data2 = await invitedBy.findOne({ Guild: usedInvite.guild!.id, User: `${member.id}` });

        if (data2) {
          data2.inviteUser = usedInvite.inviter.id;
          data2.User = member.id;
          data2.save();
        } else {
          new invitedBy({
            Guild: member.guild.id,
            inviteUser: `${usedInvite.inviter.id}`,
            User: `${member.id}`,
          }).save();
        }

        const reward = await inviteRewards.findOne({ Guild: member.guild.id, Invites: data.Invites });
        if (reward) {
          const inverter = member.guild.members.cache.has(member.id)
            ? member.guild.members.cache.get(member.id)!
            : await member.guild.members.fetch(member.guild.id);
          inverter.roles.add(reward.Role!);
        }
      }
    } catch {}
  }
}
