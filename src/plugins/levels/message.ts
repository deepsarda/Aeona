import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
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
import {
  CacheType,
  ChannelType,
  ComponentType,
  Guild,
  GuildMember,
  InviteGuild,
  Role,
  StringSelectMenuInteraction,
  TextChannel,
  User,
} from 'discord.js';
import Schema from '../../database/models/levels.js';
import SchemeMessage from '../../database/models/levelChannels.js';
import SchemaRewards from '../../database/models/levelRewards.js';
import { AeonaBot } from '../../utils/types.js';
import Canvacord from 'canvacord';
import { Components } from '../../utils/components.js';

@Discord()
@Bot(...getPluginsBot('levels'))
@Category('levels')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Levels {
  @SimpleCommand({
    name: 'levels addlevels',
    description: 'add levels to a user ➕',
  })
  async addLevels(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to add levels to',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of levels you want to add',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels addlevels <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.addLevel(user.id, ctx.guildId!, amount + '');

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

  @SimpleCommand({
    name: 'levels removelevels',
    description: 'remove levels from a user ➖',
  })
  async removeLevels(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to remove levels from',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of levels you want to remove',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels removelevels <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.addLevel(user.id, ctx.guildId!, '-' + amount);

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

  @SimpleCommand({
    name: 'levels addxp',
    description: 'add xp to a user ➕',
  })
  async addXp(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to add xp to',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of xp you want to add',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels addxp <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.addXP(user.id, ctx.guildId!, amount);

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

  @SimpleCommand({
    name: 'levels removexp',
    description: 'remove xp from a user ➖',
  })
  async removeXp(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to remove xp from',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'The amount of xp you want to remove',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels removexp <user> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.addXP(user.id, ctx.guildId!, amount * -1);

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

  @SimpleCommand({
    name: 'levels setlevel',
    description: 'set level of a user 🔨',
  })
  async setLevel(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to set level of',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'level',
      description: 'The level you want to set',
      type: SimpleCommandOptionType.Number,
    })
    level: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!level || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels setlevel <user> <level>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.setXP(user.id, ctx.guildId!, level);

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

  @SimpleCommand({
    name: 'levels setxp',
    description: 'set xp of a user 🔨',
  })
  async setXP(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to set xp of',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'xp',
      description: 'The xp you want to set',
      type: SimpleCommandOptionType.Number,
    })
    xp: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!xp || !user)
      return bot.extras.errUsage(
        {
          usage: `+levels setxp <user> <xp>`,
        },
        command,
      );

    let ctx = command.message;

    const data = await bot.extras.setXP(user.id, ctx.guildId!, xp);

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

  @SimpleCommand({
    name: 'levels createreward',
    description: 'Award a role for reaching a certain amount of levels. 🎉',
  })
  async createreward(
    @SimpleCommandOption({
      name: 'role',
      description: 'The role you want to award',
      type: SimpleCommandOptionType.Role,
    })
    role: Role | undefined,
    @SimpleCommandOption({
      name: 'amount',
      description: 'How many levels',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,

    command: SimpleCommandMessage,
  ) {
    if (!amount || !role)
      return bot.extras.errUsage(
        {
          usage: `+levels createreward <role> <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.findOne({
      Guild: ctx.guild!.id,
      Level: amount,
    });

    if (data) {
      data.Role += role.id;
      data.save();
    } else {
      data = new SchemaRewards({
        Guild: ctx.guild!.id,
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

  @SimpleCommand({
    name: 'levels removereward',
    description: 'remove a reward from my memory ❌',
  })
  async removereward(
    @SimpleCommandOption({
      name: 'amount',
      description: 'How many levels',
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!amount)
      return bot.extras.errUsage(
        {
          usage: `+levels removereward <amount>`,
        },
        command,
      );

    let ctx = command.message;

    let data = await SchemaRewards.deleteOne({
      Guild: ctx.guild!.id,
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

  @SimpleCommand({
    name: 'levels leaderboard',
    description: 'show the leaderboard for levels 🥇',
  })
  async leaderboard(command: SimpleCommandMessage) {
    let ctx = command.message;

    const rawLeaderboard = await Schema.find({
      Guild: ctx.guild!.id,
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
        `**${rawLeaderboard.findIndex((i) => i.Guild === `${ctx.guild!.id}` && i.User === e.User) + 1}** | <@!${
          e.User
        }> - Level: \`${e.level.toLocaleString()}\` (${e.xp.toLocaleString()} xp)`,
    );

    await bot.extras.createLeaderboard(`Levels - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'levels show',
    aliases: ['show', 'rank'],
    description: 'show the levels of a user 🥇',
  })
  async show(
    @SimpleCommandOption({
      name: 'user',
      description: 'The user you want to show levels from',
      type: SimpleCommandOptionType.User,
    })
    u: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!u) u = ctx.author;

    if (u instanceof GuildMember) u = u.user;

    const user = await bot.extras.fetchLevels(u.id, ctx.guild!.id);
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

    ctx.reply({
      files: [data],
    });
  }

  @SimpleCommand({
    name: 'levels rewards',
    description: 'show the levels rewards setup 🎁',
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

    const lb = rawLeaderboard.map((e) => `**${e.Level} levels** - <@&${e.Role}>`);

    await bot.extras.createLeaderboard(`Level Rewards - ${ctx.guild!.name}`, lb, command);
  }

  @SimpleCommand({
    name: 'levels levelmessage',
    description: 'Configure the level up message for this server 🗣️',
  })
  async levelmessage(command: SimpleCommandMessage) {
    let ctx = command.message;

    async function sendMessage() {
      const data = await SchemeMessage.find({ Guild: `${ctx.guild!.id}` });
      const comp = new Components();
      comp.addButton('Auto Create', 'Primary', 'autocreate');
      comp.addButton('Create', 'Success', 'createconfig');
      if (data.length > 0)
        comp.addSelectComponent(
          'Edit/Delete a system.',
          'editoptions',
          data.map((c, i) => {
            return {
              label: `System ${i}`,
              value: `${i}`,
              description: `Edit/Delete the settings for System ${i}`,
            };
          }),

          'Edit/Delete the settings for your Level Systems',
        );
      else
        comp.addSelectComponent(
          'Edit/Delete a system.',
          'editoptions',
          [
            {
              label: 'No Systems',
              value: '-1',
            },
          ],

          'There are no systems to edit.',
          1,
          1,
          true,
        );

      const message = await bot.extras.embed(
        {
          content: '',
          title: 'Level Setup',
          desc: `Choose a to edit/delete/create a system for down below. \n You currently have \`${data.length} systems\` setup. `,
          components: comp,
          type: 'editreply',
        },
        command,
      );

      message
        .awaitMessageComponent({
          filter: (i) => i.user.id == ctx.author.id,
        })
        .then(async (interaction) => {
          if (interaction.customId == 'autocreate' || interaction.customId == 'createconfig') {
            const premium = await bot.extras.isPremium(ctx.guildId!);

            if (!premium && data.length > 0) {
              interaction.reply({
                content: `Good day there, \nThis server appears to be non-premium, thus you can only have one system. \n\n  You can get premium for just **$2.99** at https://patreon.com/aeonicdiscord \n **or** \n *boost our support server*. \n Use \`+perks\` to see all the perks of premium. `,
                ephemeral: true,
              });
              return sendMessage();
            } else if (premium && data.length > 8) {
              interaction.reply({
                content: `Hello, despite the fact that this server is premium, you can only have a maximum of 8 systems owing to Discord ratelimits. Please accept my apologies for the inconvenience.`,
                ephemeral: true,
              });
              return sendMessage();
            }
          }

          if (interaction.customId == 'autocreate') {
            const channel = await ctx.guild!.channels.create({
              name: 'level-log',
              type: ChannelType.GuildText,
            });

            new Schema({
              Guild: `${ctx.guildId}`,
              Channel: `${channel.id}`,
            }).save();

            interaction.reply({
              content: `I have successfully setup <#${channel.id}> as a level log channel.`,
              ephemeral: true,
            });

            return sendMessage();
          } else if (interaction.customId == 'createconfig') {
            let success = false;
            let invalidResponse = false;

            while (!success) {
              if (!invalidResponse) {
                interaction.reply({
                  content: `Please mention the channel or send cancel to cancel the setup.`,
                  ephemeral: true,
                });
              } else {
                interaction.editReply({
                  content: `You didnt not mention a channel. Please mention the channel or send cancel to cancel the setup.`,
                });
              }

              const message = (
                await interaction.channel?.awaitMessages({
                  filter: (m) => m.author.id == ctx.author.id,
                  max: 1,
                  time: 30000,
                })
              )?.at(0);

              if (!message) return;

              if (message.content.toLowerCase() == 'cancel') {
                interaction.reply({
                  content: `Setup cancelled.`,
                  ephemeral: true,
                });

                return;
              }

              if (message.mentions.channels.size > 0) {
                success = true;

                message.delete();

                new SchemeMessage({
                  Guild: `${ctx.guildId}`,
                  Channel: `${message.mentions.channels.at(0)!.id}`,
                }).save();

                await interaction.followUp({
                  content: `I have successfully setup <#${
                    message.mentions.channels.at(0)!.id
                  }> as a level log channel.`,
                  flags: 1 << 6,
                });
              } else {
                invalidResponse = true;
              }
            }

            return sendMessage();
          } else if (interaction.customId == 'editoptions') {
            let int = interaction as unknown as StringSelectMenuInteraction<CacheType>;
            const schema = data[Number(int.values![0])];

            const components = new Components();

            components.addButton('Set Channel', 'Primary', 'setchannel');
            components.addButton('Set Message', 'Primary', 'setmessage');
            components.addButton('Delete this Setting', 'Danger', 'deleteconfig');
            const mes = await bot.extras.embed(
              {
                title: `System ${int.values![0]}`,
                desc: `
                <:F_Settings:1049292164103938128> **Settings**
                <:channel:1049292166343688192> Channel: <#${schema.Channel}>
                `,
                components: components,
                type: 'editreply',
              },
              command,
            );
            const config = await bot.extras.getEmbedConfig({
              guild: ctx.guild!,
              user: ctx.author,
            });

            let m = {
              content: '**GG** {user:mention}, you are now level **{user:level}**!',
            };

            if (schema.Message) {
              try {
                m = JSON.parse(schema.Message);
              } catch (e) {
                //
              }
            }

            m.content = `**<:chatbot:1049292165282541638> Level Message :small_red_triangle_down:** \n ${m.content}`;

            ctx.channel.send(bot.extras.generateEmbedFromData(config, m));

            mes
              .awaitMessageComponent({
                filter: (i) => i.user.id == ctx.author.id,
              })
              .then(async (interaction) => {
                if (interaction.customId == 'setchannel') {
                  let success = false;
                  let invalidResponse = false;

                  while (!success) {
                    if (!invalidResponse) {
                      await interaction.reply({
                        content: `Please mention the channel or send cancel to cancel the setup.`,
                        flags: 1 << 6,
                      });
                    } else {
                      await interaction.editReply({
                        content: `You didnt not mention a channel. Please mention the channel or send cancel to cancel the setup.`,
                      });
                    }

                    const message = (
                      await interaction.channel?.awaitMessages({
                        filter: (m) => m.author.id == ctx.author.id,
                        max: 1,
                        time: 30000,
                      })
                    )?.at(0);

                    if (!message) return;

                    if (message.content.toLowerCase() == 'cancel') {
                      await interaction.followUp({
                        content: `Setup cancelled.`,
                        flags: 1 << 6,
                      });

                      return;
                    }

                    if ((message.mentions.channels.size > 0, length > 0)) {
                      success = true;

                      message.delete();

                      schema.Channel = `${message.mentions.channels.at(0)!.id}`;
                      schema.save();

                      await interaction.followUp({
                        content: `I have successfully setup <#${
                          message.mentions.channels.at(0)!.id
                        }> as a level channel.`,
                        flags: 1 << 6,
                      });
                    } else {
                      invalidResponse = true;
                    }
                  }

                  return sendMessage();
                } else if (interaction.customId == 'setmessage') {
                  await interaction.reply({
                    content: `I am loading the message editor. To see a list of variables you can use look at \`/embed variables\``,
                    flags: 1 << 6,
                  });

                  let message = {
                    content: '**GG** {user:mention}, you are now level **{user:level}**!',
                  };

                  if (schema.Message) {
                    try {
                      message = JSON.parse(schema.Message);
                    } catch (e) {
                      //
                    }
                  }

                  bot.extras.createInterface(ctx, '', {
                    ...message,

                    callback: async (data) => {
                      schema.Message = JSON.stringify(data);

                      schema.save();

                      await interaction.followUp({
                        content: `I have successfully updated the message for that config.`,
                        flags: 1 << 6,
                      });

                      sendMessage();
                    },
                  });
                } else if (interaction.customId == 'deleteconfig') {
                  schema.deleteOne();

                  await interaction.reply({
                    content: `I have successfully deleted that config`,
                    flags: 1 << 6,
                  });

                  return sendMessage();
                }
              })
              .catch((e) => {
                mes.edit({
                  content: 'This command has expired.',
                  components: [],
                });
              });
          }
        })
        .catch((e) => {
          console.log(e);
          message.edit({
            content: 'This command has expired.',
            components: [],
          });
        });
    }
    await bot.extras.embed(
      {
        content: 'Loading....',
      },
      command,
    );
    sendMessage();
  }

  @SimpleCommand({
    name: 'levels reset',
    description: 'reset all the levels and levels rewards for this server :negative_squared_cross_mark:',
  })
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

    const randomXP = Math.floor(Math.random() * 9) + 1;
    const hasLeveledUp = await client.extras.addXP(message.author.id, message.guildId!, randomXP);

    if (hasLeveledUp) {
      const user = await client.extras.fetchLevels(message.author.id, message.guildId!);
      if (!user) return;

      const schemas = await SchemeMessage.find({
        Guild: message.guildId,
      });
      if (schemas.length > 0) {
        const config = await client.extras.getEmbedConfig({
          guild: message.guild!,
          user: message.author!,
        });

        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];

          let message = {
            content: '**GG** {user:mention}, you are now level **{user:level}**!',
          };

          if (schema.Message) {
            try {
              message = JSON.parse(schema.Message);
            } catch (e) {
              //
            }
          }
          if (schema.Channel) {
            let channel: TextChannel | undefined = bot.channels.cache.get(schema.Channel) as unknown as
              | TextChannel
              | undefined;
            if (!channel)
              channel = ((await bot.channels.fetch(schema.Channel)) as unknown as TextChannel | undefined) ?? undefined;

            channel?.send(bot.extras.generateEmbedFromData(config, message)).catch();
          }
        }
      }

      const rewards = await SchemaRewards.findOne({ Guild: message.guildId, Level: user.Level });

      if (rewards && rewards.Role) message.member?.roles.add(rewards.Role);
    }
  }
}
