import { PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Discord, Slash, SlashOption, SlashGroup } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { CommandInteraction, ApplicationCommandOptionType, GuildMember, Role, User } from 'discord.js';
import Schema from '../../database/models/levels.js';
import SchemaMessage from '../../database/models/levelChannels.js';
import SchemaRewards from '../../database/models/levelRewards.js';
import Canvacord from 'canvacord';
import { createSetupWizard } from '../../utils/setupWizard.js';

@Discord()
@Bot(...getPluginsBot('levels'))
@SlashGroup({
  name: 'levels',
  description: 'Configuration and Various Commands to use the Levels Plugin 📈',
})
@SlashGroup('levels')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Levels {
  @Slash({
    name: 'addlevels',
    description: 'add levels to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async addLevels(
    @SlashOption({
      name: 'user',
      description: 'The user you want to add levels to',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of levels you want to add',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.addLevel(user.id, command.guildId!, amount + '');

    bot.extras.succNormal(
      {
        text: `Added **${amount}** levels to <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'removelevels',
    description: 'remove levels from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async removeLevels(
    @SlashOption({
      name: 'user',
      description: 'The user you want to remove levels from',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of levels you want to remove',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.addLevel(user.id, command.guildId!, '-' + amount);

    bot.extras.succNormal(
      {
        text: `Removed **${amount}** levels to <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'addxp',
    description: 'add xp to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async addXp(
    @SlashOption({
      name: 'user',
      description: 'The user you want to add xp to',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of xp you want to add',
      type: ApplicationCommandOptionType.Number,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.addXP(user.id, command.guildId!, amount);

    bot.extras.succNormal(
      {
        text: `Added **${amount}** xp to <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'removexp',
    description: 'remove xp from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async removeXp(
    @SlashOption({
      name: 'user',
      description: 'The user you want to remove xp from',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of xp you want to remove',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.addXP(user.id, command.guildId!, amount * -1);

    bot.extras.succNormal(
      {
        text: `Removed **${amount}** xp from <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'setlevel',
    description: 'set level of a user 🔨',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async setLevel(
    @SlashOption({
      name: 'user',
      description: 'The user you want to set level of',
      type: ApplicationCommandOptionType.User,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'level',
      description: 'The level you want to set',
      type: ApplicationCommandOptionType.Number,
    })
    level: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.setXP(user.id, command.guildId!, level);

    bot.extras.succNormal(
      {
        text: `Set **${level}** level to <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'setxp',
    description: 'set xp of a user 🔨',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async setXP(
    @SlashOption({
      name: 'user',
      description: 'The user you want to set xp of',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'xp',
      description: 'The xp you want to set',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    xp: number,
    command: CommandInteraction,
  ) {
    const data = await bot.extras.setXP(user.id, command.guildId!, xp);

    bot.extras.succNormal(
      {
        text: `Set **${xp}** xp to <@${user.id}>`,
        fields: [
          {
            name: '🥇 levels',
            value: `${data.level}`,
            inline: true,
          },
          {
            name: '🥈 xp',
            value: `${data.xp}`,
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
    description: 'Award a role for reaching a certain amount of levels. 🎉',
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
      description: 'How many levels',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    let data = await SchemaRewards.findOne({
      Guild: command.guild!.id,
      Level: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: command.guild!.id,
        Level: amount,
        Role: role.id,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Level reward created. I shall now give <@&${role.id}> to members on reaching **${amount}** levels`,
        fields: [
          {
            name: '<:role:1062978537436491776> Role',
            value: `<@&${role.id}>`,
            inline: true,
          },
          {
            name: '📈 Levels Amount',
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
      description: 'How many levels',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    await SchemaRewards.deleteOne({
      Guild: command.guild!.id,
      Level: amount,
    });

    bot.extras.succNormal(
      {
        text: `Level reward removed for ${amount} levels. I shall no longer give the members a role for reaching that amount of levels.`,

        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'leaderboard',
    description: 'show the leaderboard for levels 🥇',
  })
  async leaderboard(command: CommandInteraction) {
    const rawLeaderboard = await Schema.find({
      Guild: command.guild!.id,
    }).sort([['xp', 'descending']]);

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
        }> - Level: \`${e.level.toLocaleString()}\` (${e.xp.toLocaleString()} xp)`,
    );

    await bot.extras.createLeaderboard(`Levels - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'show',
    description: 'show the levels of a user 🥇',
  })
  async show(
    @SlashOption({
      name: 'user',
      description: 'The user you want to show levels from',
      type: ApplicationCommandOptionType.User,
    })
    u: User | GuildMember | undefined,
    command: CommandInteraction,
  ) {
    if (!u) u = command.user;

    if (u instanceof GuildMember) u = u.user;

    const user = await bot.extras.fetchLevels(u.id, command.guild!.id);
    const xpRequired = bot.extras.xpFor(user.level! + 1);

    const rankCard = new Canvacord.Rank()
      .setAvatar(u.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png')
      .setRequiredXP(xpRequired)
      .setCurrentXP(user.cleanXp)
      .setLevel(user.level!)
      .setProgressBar('#FFFFFF', 'COLOR')
      .setUsername(u.username)
      .setDiscriminator(u.discriminator)
      .setStatus('dnd', true)
      .setRank(user.position);

    const data = await rankCard.build({});

    command.reply({
      files: [data],
    });
  }

  @Slash({
    name: 'rewards',
    description: 'show the levels rewards setup 🎁',
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

    const lb = rawLeaderboard.map((e) => `**${e.Level} levels** - <@&${e.Role}>`);

    await bot.extras.createLeaderboard(`Level Rewards - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'levelmessage',
    description: 'Configure the level up message for this server 🗣️',
  })
  async levelmessage(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Levels',
      {
        createCallback() {},
        options: [
          {
            name: 'message',
            callback() {},
            default: '**GG** {user:mention}, you are now level **{user:level}**!',
            id: 'message',
            schemaParam: 'Message',
          },
        ],
      },
      SchemaMessage,
    );
  }

  @Slash({
    name: 'reset',
    description: 'reset all the levels and levels rewards for this server :negative_squared_cross_mark:',
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
