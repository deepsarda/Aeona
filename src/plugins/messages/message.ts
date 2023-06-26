import { Category, RateLimit, TIME_UNIT, PermissionGuard } from '@discordx/utilities';
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
import Schema from '../../database/models/messages.js';
import SchemaRewards from '../../database/models/messageRewards.js';
import { AeonaBot } from '../../utils/types.js';

@Discord()
@Bot(...getPluginsBot('messages'))
@Category('messages')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Messages {
  @SimpleCommand({
    name: 'messages add',
    description: 'add messages to a user ➕',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async add(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to add messages to',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of messages you want to add',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+messages add <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user?.id}`,
    });
    if (data) {
      data.Messages! += amount;
      data.save();
    } else {
      data = new Schema({
        Guild: ctx.guild!.id,
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
            name: '📨 Total messages',
            value: `${data!.Messages}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'messages remove',
    description: 'remove messages from a user ➖',
  })
  @Guard(PermissionGuard(['ManageMessages']))
  async remove(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to remove messages from',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of messages you want to remove',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+messages remove <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await Schema.findOne({
      Guild: ctx.guild!.id,
      User: `${user?.id}`,
    });

    if (data) {
      data.Messages! -= amount;

      data.save();
    } else {
      data = new Schema({
        Guild: ctx.guild!.id,
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
            name: '📨 Total messages',
            value: `${data!.Messages}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'messages createreward',
    description: 'Award a role for reaching a certain amount of messages. 🎉',
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
      description: 'How many messages',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,

    command: SimpleCommandMessage,
  ) {
    if (!amount || !role)
      return bot.extras.errUsage(
        {
          usage: `+messages createreward <role> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.findOne({
      Guild: ctx.guild!.id,
      Messages: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: ctx.guild!.id,
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

  @SimpleCommand({
    name: 'messages removereward',
    description: 'remove a reward from my memory ❌',
  })
  @Guard(PermissionGuard(['ManageRoles']))
  async removereward(
    @SimpleCommandOption({
      name: 'amount',
      description: 'How many messages',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount)
      return bot.extras.errUsage(
        {
          usage: `+messages removereward <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.deleteOne({
      Guild: ctx.guild!.id,
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

  @SimpleCommand({
    name: 'messages leaderboard',
    description: 'show the leaderboard for messages 🥇',
  })
  async leaderboard(command: SimpleCommandMessage) {
    let ctx = command.message;

    const rawLeaderboard = await Schema.find({
      Guild: ctx.guild!.id,
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
        `**${rawLeaderboard.findIndex((i) => i.Guild === `${ctx.guild!.id}` && i.User === e.User) + 1}** | <@!${
          e.User
        }> - Messages: \`${e.Messages}\``,
    );

    await bot.extras.createLeaderboard(`Messages - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'messages show',
    aliases: ['mshow', 'messages rank'],
    description: 'show the messages of a user 🥇',
  })
  async show(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to show messages from',
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

  @SimpleCommand({
    name: 'messages rewards',
    description: 'show the messages rewards setup 🎁',
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

    const lb = rawLeaderboard.map((e) => `**${e.Messages} messages** - <@&${e.Role}>`);

    await bot.extras.createLeaderboard(`Message Rewards - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'messages reset',
    description: 'reset all the messages and messages rewards for this server :negative_squared_cross_mark:',
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
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (message.author.bot) return;
    const data = await Schema.findOne({ Guild: message.guildId, User: message.author.id });

    if (data) {
      data.Messages! += 1;
      data.save();

      const rewards = await SchemaRewards.findOne({ Guild: message.guildId, Messages: data.Messages });

      if (rewards && rewards.Role) message.member?.roles.add(rewards.Role);
    } else {
      new Schema({
        Guild: message.guildId,
        User: message.author.id,
        Messages: 1,
      }).save();
    }
  }
}
