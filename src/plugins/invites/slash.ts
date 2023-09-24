import { PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Discord, Slash, SlashOption, SlashGroup } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { GuildMember, Role, User, CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Schema from '../../database/models/invites.js';
import SchemaRewards from '../../database/models/inviteRewards.js';
@Discord()
@Bot(...getPluginsBot('invites'))
@SlashGroup({
  name: 'invites',
  description: 'Manage invites related features for your server',
})
@SlashGroup('invites')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Invites {
  @Slash({
    name: 'add',
    description: 'add invites to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async add(
    @SlashOption({
      name: 'user',
      description: 'The user you want to add invites to',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of invites you want to add',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    let data = await Schema.findOne({
      Guild: command.guild!.id,
      User: `${user?.id}`,
    });
    if (data) {
      data.Invites! += amount;
      data.Total! += amount;
      data.save();
    } else {
      data = new Schema({
        Guild: command.guild!.id,
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

  @Slash({
    name: 'remove',
    description: 'remove invites from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async remove(
    @SlashOption({
      name: 'user',
      description: 'The user you want to remove invites from',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of invites you want to remove',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    let data = await Schema.findOne({
      Guild: command.guild!.id,
      User: `${user?.id}`,
    });

    if (data) {
      data.Invites! -= amount;
      data.Total! -= amount;
      data.save();
    } else {
      data = new Schema({
        Guild: command.guild!.id,
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

  @Slash({
    name: 'createreward',
    description: 'Award a role for reaching a certain amount of invites. 🎉',
  })
  @Guard(PermissionGuard(['ManageRoles']))
  async createreward(
    @SlashOption({
      name: 'role',
      description: 'The role you want to award',
      type: ApplicationCommandOptionType.Role,
      required: true,
    })
    role: Role,
    @SlashOption({
      name: 'amount',
      description: 'How many invites',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,

    command: CommandInteraction,
  ) {
    let data = await SchemaRewards.findOne({
      Guild: command.guild!.id,
      Invites: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: command.guild!.id,
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

  @Slash({
    name: 'removereward',
    description: 'remove a reward from my memory ❌',
  })
  @Guard(PermissionGuard(['ManageRoles']))
  async removereward(
    @SlashOption({
      name: 'amount',
      description: 'How many invites',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    await SchemaRewards.deleteOne({
      Guild: command.guild!.id,
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

  @Slash({
    name: 'leaderboard',
    description: 'show the leaderboard for invites 🥇',
  })
  async leaderboard(command: CommandInteraction) {
    const rawLeaderboard = await Schema.find({
      Guild: command.guild!.id,
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
        `**${rawLeaderboard.findIndex((i) => i.Guild === `${command.guild!.id}` && i.User === e.User) + 1}** | <@!${
          e.User
        }> - Invites: \`${e.Invites}\``,
    );

    await bot.extras.createLeaderboard(`Invites - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'show',
    description: 'show the invites of a user 🥇',
  })
  async show(
    @SlashOption({
      name: 'user',
      description: 'The user you want to show invites from',
      type: ApplicationCommandOptionType.User,
      required: false,
    })
    user: User | GuildMember | undefined,
    command: CommandInteraction,
  ) {
    if (!user) user = command.user;

    if (user instanceof GuildMember) user = user.user;

    const data = await Schema.findOne({
      Guild: command.guild!.id,
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

  @Slash({
    name: 'rewards',
    description: 'show the invites rewards setup 🎁',
  })
  async rewards(command: CommandInteraction) {
    const rawLeaderboard = await SchemaRewards.find({
      Guild: command.guild!.id,
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

    await bot.extras.createLeaderboard(`Invite rewards - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'reset',
    description: 'reset all the invites and invites rewards for this server :negative_squared_cross_mark:',
  })
  @Guard(PermissionGuard(['ManageGuild']))
  async reset(command: CommandInteraction) {
    const deletedUsers = await Schema.deleteMany({
      Guild: command.guild!.id,
    });

    const deletedRewards = await SchemaRewards.deleteMany({
      Guild: command.guild!.id,
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
}
