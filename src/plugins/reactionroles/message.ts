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

import { getPluginsBot } from '../../utils/config.js';

import Schema from '../../database/models/reactionRoles.js';

import { AeonaBot } from '../../utils/types.js';
import { ButtonInteraction, Role, SelectMenuInteraction, TextChannel, parseEmoji } from 'discord.js';
import { bot } from '../../bot.js';
import { Components } from '../../utils/components.js';

@Discord()
@Bot(...getPluginsBot('reactionroles'))
@Category('reactionroles')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageMessages']),
)
export class ReactionRoles {
  @SimpleCommand({
    name: 'reactionroles add',
    description: 'Add a reactionrole ➕',
  })
  async add(
    @SimpleCommandOption({
      name: 'name',
      description: 'The name of the reactionrole',
      type: SimpleCommandOptionType.String,
    })
    name: string | undefined,
    @SimpleCommandOption({
      name: 'role',
      description: 'The role you want to add messages to',
      type: SimpleCommandOptionType.Role,
    })
    role: Role | undefined,

    @SimpleCommandOption({
      name: 'emoji',
      description: 'Emoji of the reactionrole',
      type: SimpleCommandOptionType.String,
    })
    emojiString: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!name || !role || !emojiString)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles add <name> <role> <emoji>`,
        },
        command,
      );

    const ctx = command.message;
    const emoji = parseEmoji(emojiString);

    if (!emoji) {
      return bot.extras.errUsage(
        {
          usage: `\` **The emoji you provided was not found**\n \'+reactionrole add <name> <role> <emoji>`,
        },
        command,
      );
    }

    const data = await Schema.findOne({
      Guild: ctx.guild!.id,
      Category: name,
    });

    if (data) {
      data.Roles[emoji.name] = [
        `${role.id}`,
        {
          id: `${emoji.id}`,
          raw: emojiString,
        },
      ];

      await Schema.findOneAndUpdate({ Guild: ctx.guild!.id, Category: name }, data);
    } else {
      new Schema({
        Guild: ctx.guild!.id,

        Category: name,
        Roles: {
          [emoji.name]: [
            `${role.id}`,
            {
              id: `${emoji.id}`,
              raw: emojiString,
            },
          ],
        },
      }).save();
    }

    bot.extras.succNormal(
      {
        text: 'Reaction role successfully created! Create a panel in the following way',
        fields: [
          {
            name: `Menu panel`,
            value: `\`/reactionroles menu ${name} <channel>\``,
            inline: true,
          },
          {
            name: `Button panel`,
            value: `\`/reactionroles button ${name} <channel>\``,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'reactionroles delete',
    description: 'Delete a reactionrole ➖',
  })
  async delete(
    @SimpleCommandOption({
      name: 'name',
      description: 'The name of the reactionrole',
      type: SimpleCommandOptionType.String,
    })
    name: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!name)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles delete <name>`,
        },
        command,
      );

    const ctx = command.message;
    await Schema.deleteOne({
      Guild: ctx.guild!.id,
      Category: name,
    });

    bot.extras.succNormal(
      {
        text: `**${name}** successfully deleted!`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'reactionroles builder',
    description: 'Create a reactionroles builder',
  })
  async builder(
    @SimpleCommandOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: SimpleCommandOptionType.String,
    })
    name: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!name)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles builder <name>`,
        },
        command,
      );

    const ctx = command.message;

    let data = await Schema.findOne({ Guild: ctx.guild!.id, Category: name });
    if (!data) {
      data = new Schema({
        Guild: ctx.guild!.id,
        Message: 0,
        Category: name,
        Roles: {},
      });

      data.save();
    }

    async function requestNextRole(): Promise<void> {
      if (!data) return;
      try {
        ctx.channel.send({
          content: `To add another role to the reaction roles, send \`:emoji: @role\`. Example: \`:sunglasses: @announcementpings \` \n\n **If you have finished adding the roles send \`cancel\` **`,
        });

        const message = (
          await ctx.channel.awaitMessages({
            filter: (m) => m.author.id === ctx.author!.id,
            max: 1,
            time: 30000,
          })
        ).first();

        if (!message || !message.content) return;
        if (message.content.toLowerCase() === 'cancel') return;

        if (message.mentions.roles.size === 0) {
          ctx.channel.send({
            content: `<@${ctx.author!.id}> Please mention a role.`,
          });
          return await requestNextRole();
        }

        const role = message.mentions.roles.at(0);
        const emoji = message.content.replace(`<@&${role}>`, '').trim();
        const parsedEmoji = parseEmoji(emoji);

        if (!parsedEmoji) {
          ctx.channel.send({
            content: `<@${ctx.author!.id}> Please mention a valid emoji.`,
          });
          return await requestNextRole();
        }

        data.Roles[parsedEmoji.name] = [
          `${role}`,
          {
            id: `${parsedEmoji.id}`,
            raw: emoji,
          },
        ];

        await Schema.findOneAndUpdate({ Guild: ctx.guild!.id, Category: name }, data);

        ctx.channel.send({
          content: `Successfully added ${emoji} to the reaction roles.`,
        });

        return await requestNextRole();
      } catch (e) {
        return;
      }
    }

    await requestNextRole();

    bot.extras.succNormal(
      {
        text: 'Reaction role successfully created! Create a panel in the following way',
        fields: [
          {
            name: `Menu panel`,
            value: `\`/reactionroles menu ${name} <channel>\``,
            inline: true,
          },
          {
            name: `Button panel`,
            value: `\`/reactionroles button ${name} <channel>\``,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'reactionroles menu',
    description: 'Create a reactionroles menu',
  })
  async menu(
    @SimpleCommandOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: SimpleCommandOptionType.String,
    })
    name: string | undefined,
    @SimpleCommandOption({
      name: 'channel',
      description: 'The channel you want to create the menu in',
      type: SimpleCommandOptionType.Channel,
    })
    channel: TextChannel | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!name || !channel)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles menu <name> <channel>`,
        },
        command,
      );

    const ctx = command.message;
    const lower = name.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
    const data = await Schema.findOne({ Guild: ctx.guild!.id, Category: name });

    if (!data)
      return bot.extras.errNormal(
        {
          error: `**${name}** does not exist!`,
          type: 'reply',
        },
        command,
      );

    const a = Object.keys(data.Roles);

    const map: string[] = [];
    const labels: any[] = [];
    for (let i = 0; i < a.length; i++) {
      const b = a[i];

      const role = ctx.guild?.roles.cache.find((role) => role.id == data.Roles[b][0]);
      if (role) {
        const emoji = parseEmoji(data.Roles[b][1].raw)!;
        map.push(
          `${
            emoji.id
              ? emoji.animated
                ? `<a:${emoji.name}:${emoji.id}>`
                : `<:${emoji.name}:${emoji.id}>`
              : `${emoji.name}`
          } | <@&${role.id}>`,
        );

        labels.push({
          label: `${role.name}`,
          description: `Add or remove the role ${role.name}`,
          emoji: emoji,
          value: role.id,
        });
      }
    }
    const mappedstring = map.join('\n');
    const row = new Components();
    row.addSelectComponent('Choose your row', 'reaction_select', labels, '❌ Nothing selected', 1, map.length);

    const m = await bot.extras.embed(
      {
        title: `${upper} Roles`,
        desc: `Choose your roles in the menu! \n\n${mappedstring}`,
        components: row,
        type: 'reply',
      },
      channel,
    );

    bot.extras.succNormal(
      {
        text:
          'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* category to modify thier look.` \n Example use: `+editembed <#' +
          channel.id +
          '> ' +
          m.id +
          '`',
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'reactionroles button',
    description: 'Create a reactionroles button',
  })
  async button(
    @SimpleCommandOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: SimpleCommandOptionType.String,
    })
    name: string | undefined,
    @SimpleCommandOption({
      name: 'channel',
      description: 'The channel you want to create the button in',
      type: SimpleCommandOptionType.Channel,
    })
    channel: TextChannel | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!name || !channel)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles button <name> <channel>`,
        },
        command,
      );

    const ctx = command.message;
    const lower = name.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
    const data = await Schema.findOne({ Guild: ctx.guild!.id, Category: name });

    if (!data)
      return bot.extras.errNormal(
        {
          error: `**${name}** does not exist!`,
          type: 'reply',
        },
        command,
      );

    const a = Object.keys(data.Roles);

    const map: string[] = [];
    const labels: string[] = [];
    const ids: string[] = [];
    for (let i = 0; i < a.length; i++) {
      const b = a[i];
      const role = ctx.guild?.roles.cache.find((role) => role.id == data.Roles[b][0]);
      if (role) {
        const emoji = parseEmoji(data.Roles[b][1].raw)!;
        map.push(
          `${
            emoji.id
              ? emoji.animated
                ? `<a:${emoji.name}:${emoji.id}>`
                : `<:${emoji.name}:${emoji.id}>`
              : `${emoji.name}`
          } | <@&${role.id}>`,
        );

        labels.push(`${emoji.id ?? emoji.name}`);
        ids.push(role.id);
      }
    }

    const comp = bot.extras.buttonReactions(labels, ids);

    const m = await bot.extras.embed(
      {
        title: `${upper} Roles`,
        desc: `Choose your roles by clicking the correct button! \n\n${map.join('\n')}`,
        components: comp,
        type: 'reply',
      },
      channel,
    );

    bot.extras.succNormal(
      {
        text:
          'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* category to modify thier look.` \n Example use: `+editembed <#' +
          channel.id +
          '> ' +
          m.id +
          '`',
        type: 'reply',
      },
      command,
    );
  }

  @On()
  async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: AeonaBot) {
    if (interaction.isButton()) {
      const i = interaction as ButtonInteraction;
      if (i.customId.startsWith('reaction_button-')) {
        await i.deferReply({
          ephemeral: true,
        });
        const id = i.customId.split('-')[1];

        const mem =
          interaction.guild?.members.cache.get(interaction.user.id) ??
          (await interaction.guild?.members.fetch(interaction.user.id))!;

        if (mem.roles.cache.has(id)) {
          mem.roles.remove(id);
          i.editReply({ content: `<@&${id}> was removed!` });
        } else {
          mem.roles.add(id);
          i.editReply({ content: `<@&${id}> was added!` });
        }
      }
    }

    if (interaction.isStringSelectMenu()) {
      const i = interaction as SelectMenuInteraction;
      if (i.customId.startsWith('reaction_select')) {
        await i.deferReply({
          ephemeral: true,
        });
        const mem =
          interaction.guild?.members.cache.get(i.user.id) ?? (await interaction.guild?.members.fetch(i.user.id))!;
        let roles = '';
        i.values.forEach((id) => {
          if (mem.roles.cache.has(id)) {
            mem.roles.remove(id);

            roles += `<@&${id}>`;
          } else {
            mem.roles.add(id);

            roles += `<@&${id}>`;
          }
        });

        i.editReply({ content: `I have updated the following roles for you: ${roles}` });
      }
    }
  }
}
