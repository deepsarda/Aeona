import { RateLimit, TIME_UNIT, PermissionGuard } from '@discordx/utilities';
import { Bot, Guard, Discord, Slash, SlashOption, SlashGroup } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { GuildMember, Role, User, CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Schema from '../../database/models/messages.js';
import SchemaRewards from '../../database/models/messageRewards.js';
@Discord()
@Bot(...getPluginsBot('messages'))
@SlashGroup({
  name: 'messages',
  description: 'Manage messages related features for your server 💬',
})
@SlashGroup('messages')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Messages {
  @Slash({
    name: 'add',
    description: 'add messages to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async add(
    @SlashOption({
      name: 'user',
      description: 'The user you want to add messages to',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of messages you want to add',
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
      data.Messages! += amount;
      data.save();
    } else {
      data = new Schema({
        Guild: command.guild!.id,
        User: `${user?.id}`,
        Messages: amount,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Added **${amount}** messages to <@${user.id}>`,
        fields: [
          {
            name: '📨 Total Messages',
            value: `${data!.Messages}`,
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
    description: 'remove messages from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async remove(
    @SlashOption({
      name: 'user',
      description: 'The user you want to remove messages from',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    @SlashOption({
      name: 'amount',
      description: 'The amount of messages you want to remove',
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
      data.Messages! -= amount;

      data.save();
    } else {
      data = new Schema({
        Guild: command.guild!.id,
        User: `${user?.id}`,
        Messages: amount,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Removed **${amount}** messages from <@${user.id}>`,
        fields: [
          {
            name: '📨 Total Messages',
            value: `${data!.Messages}`,
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
    description: 'Award a role for reaching a certain amount of messages. 🎉',
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
      description: 'How many messages',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,

    command: CommandInteraction,
  ) {
    let data = await SchemaRewards.findOne({
      Guild: command.guild!.id,
      Messages: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: command.guild!.id,
        Messages: amount,
        Role: role.id,
      });

      data.save();
    }

    bot.extras.succNormal(
      {
        text: `Message reward created. I shall now give <@&${role.id}> to members on reaching **${amount}** messages`,
        fields: [
          {
            name: '<:role:1062978537436491776> Role',
            value: `<@&${role.id}>`,
            inline: true,
          },
          {
            name: '📈 Messages Amount',
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
      description: 'How many messages',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    amount: number,
    command: CommandInteraction,
  ) {
    await SchemaRewards.deleteOne({
      Guild: command.guild!.id,
      Messages: amount,
    });

    bot.extras.succNormal(
      {
        text: `Message reward removed for ${amount} messages. I shall no longer give the members a role for reaching that amount of messages.`,

        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'leaderboard',
    description: 'show the leaderboard for messages 🥇',
  })
  async leaderboard(command: CommandInteraction) {
    const rawLeaderboard = await Schema.find({
      Guild: command.guild!.id,
    }).sort([['Messages', 'descending']]);

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
        }> - Messages: \`${e.Messages}\``,
    );

    await bot.extras.createLeaderboard(`Messages - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'show',
    description: 'show the Messages of a user 🥇',
  })
  async show(
    @SlashOption({
      name: 'user',
      description: 'The user you want to show messages from',
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
          title: 'Messages',
          desc: `**${`${user.tag}`}** has \`${data.Messages}\` messages`,

          type: 'reply',
        },
        command,
      );
    } else {
      bot.extras.embed(
        {
          title: 'Messages',
          desc: `**${`${user.tag}`}** has \`0\` messages`,

          type: 'reply',
        },
        command,
      );
    }
  }

  @Slash({
    name: 'rewards',
    description: 'show the messages rewards setup 🎁',
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

    const lb = rawLeaderboard.map((e) => `**${e.Messages} Messages** - <@&${e.Role}>`);

    await bot.extras.createLeaderboard(`Messages rewards - ${command.guild!.name}`, lb, command);
  }

  @Slash({
    name: 'reset',
    description: 'reset all the messages and message rewards for this server :negative_squared_cross_mark:',
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
