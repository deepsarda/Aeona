import { RateLimit, TIME_UNIT, PermissionGuard } from '@discordx/utilities';
import { Bot, SlashGroup, Guard, Discord, Slash, SlashOption, On, ArgsOf } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import Schema from '../../database/models/reactionRoles.js';

import { CommandInteraction, ApplicationCommandOptionType, Role, TextChannel, parseEmoji } from 'discord.js';
import { bot } from '../../bot.js';
import { Components } from '../../utils/components.js';

@Discord()
@Bot(...getPluginsBot('reactionroles'))
@SlashGroup({
  name: 'reactionroles',
  description: 'Various commands to manage reactionroles 🎉',
})
@SlashGroup('reactionroles')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageMessages']),
)
export class ReactionRoles {
  @Slash({
    name: 'add',
    description: 'Add a reactionrole ➕',
  })
  async add(
    @SlashOption({
      name: 'name',
      description: 'The name of the reactionrole',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    name: string,
    @SlashOption({
      name: 'role',
      description: 'The role you want to add messages to',
      type: ApplicationCommandOptionType.Role,
      required: true,
    })
    role: Role,

    @SlashOption({
      name: 'emoji',
      description: 'Emoji of the reactionrole',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    emojiString: string,
    command: CommandInteraction,
  ) {
    if (!name || !role || !emojiString)
      return bot.extras.errUsage(
        {
          usage: `+reactionrole add <name> <role> <emoji>`,
        },
        command,
      );

    let emoji = parseEmoji(emojiString);

    if (!emoji) {
      return bot.extras.errUsage(
        {
          usage: `\` **The emoji you provided was not found**\n \'+reactionrole add <name> <role> <emoji>`,
        },
        command,
      );
    }

    let data = await Schema.findOne({
      Guild: command.guild!.id,
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

      await Schema.findOneAndUpdate({ Guild: command.guild!.id, Category: name }, data);
    } else {
      new Schema({
        Guild: command.guild!.id,

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

  @Slash({
    name: 'delete',
    description: 'Delete a reactionrole ➖',
  })
  async delete(
    @SlashOption({
      name: 'name',
      description: 'The name of the reactionrole',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    name: string,
    command: CommandInteraction,
  ) {
    if (!name)
      return bot.extras.errUsage(
        {
          usage: `+reactionrole delete <name>`,
        },
        command,
      );

    await Schema.deleteOne({
      Guild: command.guild!.id,
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

  @Slash({
    name: 'builder',
    description: 'Create a reactionroles builder',
  })
  async builder(
    @SlashOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    name: string,
    command: CommandInteraction,
  ) {
    if (!name)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles builder <name>`,
        },
        command,
      );

    let data = await Schema.findOne({ Guild: command.guild!.id, Category: name });
    if (!data) {
      data = new Schema({
        Guild: command.guild!.id,
        Message: 0,
        Category: name,
        Roles: {},
      });

      data.save();
    }

    async function requestNextRole(): Promise<void> {
      if (!data) return;
      try {
        command.channel!.send({
          content: `To add another role to the reaction roles, send \`:emoji: @role\`. Example: \`:sunglasses: @announcementpings \` \n\n **If you have finished adding the roles send \`cancel\` **`,
        });

        const message = (
          await command.channel!.awaitMessages({
            filter: (m) => m.author.id === command.user!.id,
            max: 1,
            time: 30000,
          })
        ).first();

        if (!message || !message.content) return;
        if (message.content.toLowerCase() === 'cancel') return;

        if (message.mentions.roles.size === 0) {
          command.channel!.send({
            content: `<@${command.user!.id}> Please mention a role.`,
          });
          return await requestNextRole();
        }

        const role = message.mentions.roles.at(0);
        const emoji = message.content.replace(`<@&${role}>`, '').trim();
        const parsedEmoji = parseEmoji(emoji);

        if (!parsedEmoji) {
          command.channel!.send({
            content: `<@${command.user!.id}> Please mention a valid emoji.`,
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

        await Schema.findOneAndUpdate({ Guild: command.guild!.id, Category: name }, data);

        command.channel!.send({
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

  @Slash({
    name: 'menu',
    description: 'Create a reactionroles menu',
  })
  async menu(
    @SlashOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    name: string,
    @SlashOption({
      name: 'channel',
      description: 'The channel you want to create the menu in',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    })
    channel: TextChannel,
    command: CommandInteraction,
  ) {
    if (!name || !channel)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles menu <name> <channel>`,
        },
        command,
      );

    const lower = name.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
    const data = await Schema.findOne({ Guild: command.guild!.id, Category: name });

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

      const role = command.guild?.roles.cache.find((role) => role.id == data.Roles[b][0]);
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
          'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* SlashGroup to modify thier look.` \n Example use: `+editembed <#' +
          channel.id +
          '> ' +
          m.id +
          '`',
        type: 'reply',
      },
      command,
    );
  }

  @Slash({
    name: 'button',
    description: 'Create a reactionroles button',
  })
  async button(
    @SlashOption({
      name: 'name',
      description: 'The name of the reactionroles',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    name: string,
    @SlashOption({
      name: 'channel',
      description: 'The channel you want to create the button in',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    })
    channel: TextChannel,
    command: CommandInteraction,
  ) {
    if (!name || !channel)
      return bot.extras.errUsage(
        {
          usage: `+reactionroles button <name> <channel>`,
        },
        command,
      );

    const lower = name.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
    const data = await Schema.findOne({ Guild: command.guild!.id, Category: name });

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
      const role = command.guild?.roles.cache.find((role) => role.id == data.Roles[b][0]);
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
          'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* SlashGroup to modify thier look.` \n Example use: `+editembed <#' +
          channel.id +
          '> ' +
          m.id +
          '`',
        type: 'reply',
      },
      command,
    );
  }
}
