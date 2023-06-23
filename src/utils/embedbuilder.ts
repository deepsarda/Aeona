import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Guild,
  Interaction,
  Message,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  User,
} from 'discord.js';
import inviteBy from '../database/models/inviteBy.js';
import invites from '../database/models/invites.js';
import { AeonaBot } from './types.js';

export default (client: AeonaBot) => {
  /*
  _   _      _
 | | | | ___| |_ __   ___ _ __ ___
 | |_| |/ _ \ | '_ \ / _ \ '__/ __|
 |  _  |  __/ | |_) |  __/ |  \__ \
 |_| |_|\___|_| .__/ \___|_|  |___/
              |_|
  */
  function createComponents() {
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row.addComponents(
      new ButtonBuilder().setLabel('Set/Delete Title').setStyle(2).setCustomId('settitle'),
      new ButtonBuilder().setLabel('Set/Delete Description').setStyle(2).setCustomId('setdescription'),
      new ButtonBuilder().setLabel('Set/Delete Image').setStyle(2).setCustomId('setimage'),
      new ButtonBuilder().setLabel('Set/Delete Thumbnail').setStyle(2).setCustomId('setthumbnail'),
    );

    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row2.addComponents(
      new ButtonBuilder().setLabel('Set/Delete Author').setStyle(2).setCustomId('setauthor'),
      new ButtonBuilder().setLabel('Set/Delete Footer').setStyle(2).setCustomId('setfooter'),
      new ButtonBuilder().setLabel('Set/Delete Content').setStyle(2).setCustomId('setcontent'),
      new ButtonBuilder().setLabel('Set/Delete Color').setStyle(2).setCustomId('setcolor'),
    );

    const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row3.addComponents(
      new ButtonBuilder().setLabel('Set/Delete Fields').setStyle(2).setCustomId('setfields'),
      new ButtonBuilder().setLabel('Save').setStyle(3).setCustomId('sendembed'),
    );

    return [row, row2, row3];
  }
  async function fetchData(userId: string, guildId: string) {
    const user = await client.extras.fetchLevels(userId, guildId);
    const inviteData = await invites.findOne({
      Guild: `${guildId}`,
      User: userId,
    });
    return {
      levels: {
        level: user.level,
        xp: user.cleanXp,
        rank: user.position,
      },
      invites: inviteData?.Invites,
      left: inviteData?.Left,
      user: (await client.users.cache.get(userId))!,
    };
  }
  async function getEmbedConfig(ctx: { guild?: Guild; user?: User }): Promise<Config> {
    const userData = await fetchData(ctx.user!.id, ctx.guild!.id);
    const inviter = await inviteBy.findOne({
      Guild: `${ctx.guild!.id}`,
      User: `${ctx.user!.id}`,
    });
    let inviterData;
    if (inviter) inviterData = await fetchData(inviter.inviteUser!, ctx.guild!.id);
    return {
      user: userData.user,
      guild: client.guilds.cache.get(ctx.guild!.id)!,
      inviter: inviterData,
      levels: userData.levels,
      userInvites: { invites: userData.invites, left: userData.left },
    };
  }
  /*
              ____                   __  __      _   _               _
             | __ )  __ _ ___  ___  |  \/  | ___| |_| |__   ___   __| |
             |  _ \ / _` / __|/ _ \ | |\/| |/ _ \ __| '_ \ / _ \ / _` |
             | |_) | (_| \__ \  __/ | |  | |  __/ |_| | | | (_) | (_| |
             |____/ \__,_|___/\___| |_|  |_|\___|\__|_| |_|\___/ \__,_|

              */
  async function createInterface(ctx: Message | CommandInteraction, defaultContent: string, embedData: Embed) {
    if (!embedData.title && !embedData.description && !embedData.content)
      embedData = {
        content: defaultContent,
        title: 'Variables for you to use.',
        description: `
                    <:ayyy:1056627813286952980> **User Variables**
                     __Variable <:F_Arrow:1049291677359153202> Description <:F_Arrow:1049291677359153202> Example__
                     \`{user:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {user:username}
                     \`{user:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {user:discriminator}
                     \`{user:tag}\` <:F_Arrow:1049291677359153202> User's Tag<:F_Arrow:1049291677359153202> {user:tag}
                     \`{user:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {user:mention}
                     \`{user:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {user:invites}
                     \`{user:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {user:invites:left}
                     \`{user:level}\` <:F_Arrow:1049291677359153202> User's level<:F_Arrow:1049291677359153202> {user:level}
                     \`{user:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {user:xp}
                     \`{user:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {user:rank}
                     \`{user:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
                   <:YaeSmug:1062031989714198678> **Inviter Variables** *The user who invited the user*
                     \`{inviter:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {inviter:username}
                     \`{inviter:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {inviter:discriminator}
                     \`{inviter:tag}\` <:F_Arrow:1049291677359153202> User's Tag <:F_Arrow:1049291677359153202> {inviter:tag}
                     \`{inviter:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {inviter:mention}
                     \`{inviter:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {inviter:invites}
                     \`{inviter:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {inviter:invites:left}
                     \`{inviter:level}\` <:F_Arrow:1049291677359153202> User's level <:F_Arrow:1049291677359153202> {inviter:level}
                     \`{inviter:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {inviter:xp}
                     \`{inviter:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {inviter:rank}
                     \`{inviter:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
                   <:AH_LoveCat:1050681792060985414> **Server Variables**
                     \`{guild:name}\` <:F_Arrow:1049291677359153202> Server's Name <:F_Arrow:1049291677359153202> {guild:name}
                     \`{guild:owner}\` <:F_Arrow:1049291677359153202> Ping to the server's owner <:F_Arrow:1049291677359153202> {guild:owner}
                     \`{guild:members}\` <:F_Arrow:1049291677359153202> Number of users in this server.
                     \`{guild:tier}\` <:F_Arrow:1049291677359153202> Server's boosting tier <:F_Arrow:1049291677359153202> {guild:tier}
                     \`{guild:description}\` <:F_Arrow:1049291677359153202> Server's description <:F_Arrow:1049291677359153202> {guild:description}
                     \`{guild:boosts}\` <:F_Arrow:1049291677359153202>The number of boosts this server has <:F_Arrow:1049291677359153202>3 {guild:boosts}
                     \`{guild:rules}\` <:F_Arrow:1049291677359153202> The ping of the channel setup for rules <:F_Arrow:1049291677359153202> {guild:rules}
                     \`{guild:icon}\` <:F_Arrow:1049291677359153202> Link to server's icon
                     \`{guild:banner}\` <:F_Arrow:1049291677359153202> Link to server's banner


                     **Remove remove this click on \`Set/Delete Description\` and then send \`cancel\`.**
                    `,
        callback: embedData.callback,
      };

    const config = await getEmbedConfig(
      ctx instanceof CommandInteraction
        ? {
            guild: ctx.guild!,
            user: ctx.user!,
          }
        : {
            guild: ctx.guild!,
            user: ctx.author!,
          },
    );
    if (ctx instanceof Message) {
      const message = await ctx.reply({ content: 'Loading Embed...' });
      updateEmbed(message, embedData, config);
    } else {
      const m = await ctx.reply({ content: 'Loading Embed...' });

      const message = await m.fetch();
      updateEmbed(message, embedData, config);
    }
  }

  /*
               __  __      _   _               _
             |  \/  | ___| |_| |__   ___   __| |___
             | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
             | |  | |  __/ |_| | | | (_) | (_| \__ \
             |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
             */
  async function updateEmbed(message: Message, embedData: Embed, config: Config) {
    const embed = generateEmbedFromData(config, embedData);

    const comp = createComponents();
    message.edit({
      ...embed,
      components: comp,
    });
    message
      .awaitMessageComponent({
        filter(data) {
          return data.user.id === config.user.id;
        },
      })
      .then((interaction) => {
        interaction.deferReply();
        if (interaction.customId == 'setauthor') setAuthor(message, interaction, embedData, config);

        if (interaction.customId == 'setfooter') setFooter(message, interaction, embedData!, config);

        if (interaction.customId == 'settitle') setTitle(message, interaction, embedData, config);

        if (interaction.customId == 'setdescription') setDescription(message, interaction, embedData, config);

        if (interaction.customId == 'setcontent') setContent(message, interaction, embedData, config);

        if (interaction.customId == 'setimage') setImage(message, interaction, embedData, config);

        if (interaction.customId == 'setcolor') setColor(message, interaction, embedData, config);

        if (interaction.customId == 'setthumbnail') setThumbnail(message, interaction, embedData, config);

        if (interaction.customId == 'sendembed') if (embedData.callback) embedData.callback({ ...embedData });

        if (interaction.customId == 'setfields') setFields(message, interaction, embedData, config);
      })
      .catch(() => {
        message.edit({
          content: 'This command has expired.',
          components: [],
        });
      });
  }
  async function setTitle(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    message.edit({
      content:
        '**Send the title** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = (
      await message.channel.awaitMessages({
        filter: (m) => m.author.id === interaction.user.id,
        max: 1,
      })
    ).first();
    if (!m)
      return message.edit({
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });

    m.delete();
    if (m.content.trim().toLowerCase() == 'cancel') embedData.title = undefined;
    else embedData.title = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setDescription(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    message.edit({
      content:
        '**Send the description for the embed.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = (
      await message.channel.awaitMessages({
        filter: (m) => m.author.id === interaction.user.id,
        max: 1,
      })
    ).first();

    if (!m)
      return message.edit({
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });
    m.delete();
    if (m.content.trim().toLowerCase() == 'cancel') embedData.description = undefined;
    else embedData.description = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setContent(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    message.edit({
      content:
        '**Send the content for the embed.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = (
      await message.channel.awaitMessages({
        filter: (m) => m.author.id === interaction.user.id,
        max: 1,
      })
    ).first();

    if (!m)
      return message.edit({
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });

    m.delete();
    if (m.content.trim().toLowerCase() == 'cancel') embedData.content = undefined;
    else embedData.content = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setThumbnail(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      message.edit({
        content: `${
          failed ? 'The message you sent was not a link.\n' : ''
        }**Send the url to set as the thumbnail.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**\n :x: To remove it send \`cancel\``,
        embeds: [],
        components: [],
      });

      const m = (
        await message.channel.awaitMessages({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1,
        })
      ).first();

      if (!m)
        return message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      m.delete();
      m.content = m.content.trim();
      if (m.content.trim().toLowerCase() == 'cancel') {
        embedData.thumbnail = undefined;
        break;
      } else if (
        m.content.startsWith('http://') ||
        m.content.startsWith('https://') ||
        m.content == '{user:avatar}' ||
        m.content == '{inviter:avatar}' ||
        m.content == '{guild:icon}' ||
        m.content == '{guild:banner}'
      ) {
        embedData.thumbnail = { url: m.content };
        break;
      }

      failed = true;
    }
    updateEmbed(message, embedData, config);
  }
  async function setImage(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      message.edit({
        content: `${
          failed ? 'The message you sent was not a link.\n' : ''
        }**Send the url to set as the image** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**\n :x: To remove it send \`cancel\``,
        embeds: [],
        components: [],
      });

      const m = (
        await message.channel.awaitMessages({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1,
        })
      ).first();

      if (!m)
        return message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      m.delete();
      m.content = m.content.trim();
      if (m.content.trim().toLowerCase() == 'cancel') {
        embedData.image = undefined;
        break;
      } else if (
        m.content.startsWith('http://') ||
        m.content.startsWith('https://') ||
        m.content == '{user:avatar}' ||
        m.content == '{inviter:avatar}' ||
        m.content == '{guild:icon}' ||
        m.content == '{guild:banner}'
      ) {
        embedData.image = { url: m.content };
        break;
      }

      failed = true;
    }
    updateEmbed(message, embedData, config);
  }
  async function setColor(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      message.edit({
        content: `${
          failed ? 'The message you sent was not a link.\n' : ''
        }**Send the hex value to set as the color for the embed.** \n\n <:pInfo:1071022668066865162> This value must be a valid hexadecimal color. Example: #ffffff\n :x: To remove it send \`cancel\``,
        embeds: [],
        components: [],
      });

      const m = (
        await message.channel.awaitMessages({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1,
        })
      ).first();

      if (!m)
        return message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      m.delete();
      m.content = m.content.trim();
      if (m.content.trim().toLowerCase() == 'cancel') {
        embedData.color = undefined;
        break;
      } else if (/^#[0-9A-F]{6}$/i.test(m.content)) {
        embedData.color = Number(m.content.replace('#', '0x'));
        break;
      }

      failed = true;
    }
    updateEmbed(message, embedData, config);
  }

  async function setAuthor(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row.addComponents(
      new ButtonBuilder().setLabel('Set Author to User').setStyle(ButtonStyle.Primary).setCustomId('setauthoruser'),
      new ButtonBuilder()
        .setLabel('Set Author to Inviter')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('setauthorinviter'),
      new ButtonBuilder()
        .setLabel('Set Author to Server')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('setauthorguild'),
      new ButtonBuilder().setLabel('Set Author Name').setStyle(ButtonStyle.Secondary).setCustomId('setauthorname'),
      new ButtonBuilder().setLabel('Set Author Avatar').setStyle(ButtonStyle.Secondary).setCustomId('setauthoravatar'),
    );
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row2.addComponents(
      new ButtonBuilder().setLabel('Remove Author').setStyle(ButtonStyle.Danger).setCustomId('removeauthor'),
    );

    message.edit({
      content: 'Choose your choice from below.',
      embeds: [],
      components: [row, row2],
    });

    message
      .awaitMessageComponent({
        filter(data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        interaction.deferReply();
        if (interaction.customId == 'setauthoruser') {
          if (!embedData.author)
            embedData.author = {
              name: '{user:tag}',
              icon: '{user:avatar}',
            };
          else {
            embedData.author.name = '{user:tag}';
            embedData.author.icon = '{user:avatar}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setauthorinviter') {
          if (!embedData.author)
            embedData.author = {
              name: '{inviter:tag}',
              icon: '{inviter:avatar}',
            };
          else {
            embedData.author.name = '{inviter:tag}';
            embedData.author.icon = '{inviter:avatar}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setauthorguild') {
          if (!embedData.author)
            embedData.author = {
              name: '{guild:name}',
              icon: '{guild:icon}',
            };
          else {
            embedData.author.name = '{guild:name}';
            embedData.author.icon = '{guild:icon}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setauthorname') {
          message.edit({
            content:
              '**Send the name of the author.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = (
            await message.channel.awaitMessages({
              filter: (m) => m.author.id === interaction.user.id,
              max: 1,
            })
          ).first();

          if (!m)
            return message.edit({
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          m.delete();
          if (!embedData.author)
            embedData.author = {
              name: m.content,
            };
          else embedData.author.name = m.content;

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setauthoravatar') {
          let failed = false;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            message.edit({
              content: `${
                failed ? 'The message you sent was not a link.\n' : ''
              }**Send the url to set as the author's avatar.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**`,
              embeds: [],
              components: [],
            });

            const m = (
              await message.channel.awaitMessages({
                filter: (m) => m.author.id === interaction.user.id,
                max: 1,
              })
            ).first();

            if (!m)
              return message.edit({
                content: 'This command has expired.',
                embeds: [],
                components: [],
              });
            m.delete();
            m.content = m.content.trim();
            if (
              m.content.startsWith('http://') ||
              m.content.startsWith('https://') ||
              m.content == '{user:avatar}' ||
              m.content == '{inviter:avatar}' ||
              m.content == '{guild:icon}' ||
              m.content == '{guild:banner}'
            ) {
              if (embedData.author) embedData.author.icon = m.content;
              else
                embedData.author = {
                  name: 'No author name given. Please set it.',
                  icon: m.content,
                };

              break;
            }

            failed = true;
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'removeauthor') {
          embedData.author = undefined;
          updateEmbed(message, embedData, config);
        }
      })
      .catch(() => {
        message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      });
  }
  async function setField(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
    index?: number,
  ) {
    const embed = new EmbedBuilder();
    embed.setTitle('Field Visualizer');
    if (index == undefined) {
      if (!embedData.fields) embedData.fields = [];

      embedData.fields.push({
        name: 'Default Title. Change me.',
        value: 'Default Description. Change Me',
      });
      index = embedData.fields.length - 1;
    }

    embed.addFields([
      {
        name: embedData.fields![index].name,
        value: embedData.fields![index].value,
        inline: embedData.fields![index].inline,
      },
    ]);

    if (!index) index = 0;
    const comp = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    comp.addComponents(
      new ButtonBuilder().setLabel('Save Field').setStyle(ButtonStyle.Success).setCustomId('savefield'),
      new ButtonBuilder().setLabel('Change Title').setStyle(ButtonStyle.Secondary).setCustomId('changetitle'),
      new ButtonBuilder()
        .setLabel('Change Description')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('changedescription'),
      new ButtonBuilder().setLabel('Toggle Inline').setStyle(ButtonStyle.Secondary).setCustomId('toggleinline'),
      new ButtonBuilder().setLabel('Remove Field').setStyle(ButtonStyle.Danger).setCustomId('removefield'),
    );

    message.edit({
      content: 'Choose your choice from below.',
      embeds: [embed],
      components: [comp],
    });

    message
      .awaitMessageComponent({
        filter(data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        interaction.deleteReply();

        if (interaction.customId == 'savefield') updateEmbed(message, embedData, config);
        if (interaction.customId == 'removefield') {
          (embedData.fields = embedData.fields!.filter((value, i) => {
            return i != index!;
          })),
            console.log(embedData.fields);
          updateEmbed(message, embedData, config);
        }
        if (interaction.customId == 'changetitle') {
          message.edit({
            content:
              '**Send the title of the field.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = (
            await message.channel.awaitMessages({
              filter: (m) => m.author.id === interaction.user.id,
              max: 1,
            })
          ).first();

          if (!m)
            return message.edit({
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          m.delete();
          embedData.fields![index!].name = m.content;
          setField(message, interaction, embedData, config, index);
        }
        if (interaction.customId == 'changedescription') {
          message.edit({
            content:
              '**Send the description of the field.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = (
            await message.channel.awaitMessages({
              filter: (m) => m.author.id === interaction.user.id,
              max: 1,
            })
          ).first();

          if (!m)
            return message.edit({
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          m.delete();
          embedData.fields![index!].value = m.content;
          setField(message, interaction, embedData, config, index);
        }
      });
  }
  async function setFields(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    const comp = new ActionRowBuilder<StringSelectMenuBuilder>();
    const options = [
      {
        label: 'Add a field.',
        description: 'Add a field to the end.',
        value: 'add',
      },
    ];
    if (embedData.fields)
      options.push(
        ...embedData.fields.map((field, index) => {
          return {
            label: field.name,
            value: `${index}`,
            description: 'modify or delete this field',
          };
        }),
      );

    comp.addComponents(
      new StringSelectMenuBuilder().setPlaceholder('Customise the fields.').setOptions(options).setCustomId('fields'),
    );

    message.edit({
      content: 'Choose your choice from below.',
      embeds: [],
      components: [comp],
    });

    message
      .awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter(data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        interaction.deleteReply();
        if (interaction.values) {
          if (interaction.values[0] == 'add') {
            setField(message, interaction, embedData, config);
          } else {
            console.log(Number(interaction.values[0]));
            setField(message, interaction, embedData, config, Number(interaction.values[0]));
          }
        }
      })

      .catch(() => {
        message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      });
  }
  async function setFooter(message: Message, interaction: Interaction, embedData: Embed, config: Config) {
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row.addComponents(
      new ButtonBuilder().setLabel('Set Footer to User').setStyle(ButtonStyle.Primary).setCustomId('setfooteruser'),
      new ButtonBuilder()
        .setLabel('Set Footer to Inviter')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('setfooterinviter'),
      new ButtonBuilder()
        .setLabel('Set Footer to Server')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('setfooterguild'),
      new ButtonBuilder().setLabel('Set Footer Name').setStyle(ButtonStyle.Secondary).setCustomId('setfootername'),
      new ButtonBuilder().setLabel('Set Footer Avatar').setStyle(ButtonStyle.Secondary).setCustomId('setfooteravatar'),
    );
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row2.addComponents(
      new ButtonBuilder().setLabel('Remove Footer').setStyle(ButtonStyle.Danger).setCustomId('removefooter'),
    );
    message.edit({
      content: 'Choose your choice from below.',
      embeds: [],
      components: [row, row2],
    });

    message
      .awaitMessageComponent({
        filter(data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        interaction.deleteReply();
        if (interaction.customId == 'setfooteruser') {
          if (!embedData.footer)
            embedData.footer = {
              text: '{user:tag}',
              icon: '{user:avatar}',
            };
          else {
            embedData.footer.text = '{user:tag}';
            embedData.footer.icon = '{user:avatar}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setfooterinviter') {
          if (!embedData.footer)
            embedData.footer = {
              text: '{inviter:tag}',
              icon: '{inviter:avatar}',
            };
          else {
            embedData.footer.text = '{inviter:tag}';
            embedData.footer.icon = '{inviter:avatar}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setfooterguild') {
          if (!embedData.footer)
            embedData.footer = {
              text: '{guild:name}',
              icon: '{guild:icon}',
            };
          else {
            embedData.footer.text = '{guild:name}';
            embedData.footer.icon = '{guild:icon}';
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setfootername') {
          message.edit({
            content:
              '**Send the text of the footer.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = (
            await message.channel.awaitMessages({
              filter: (m) => m.author.id === interaction.user.id,
              max: 1,
            })
          ).first();

          if (!m)
            return message.edit({
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          m.delete();
          if (!embedData.footer)
            embedData.footer = {
              text: m.content,
            };
          else embedData.footer.text = m.content;

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'setfooteravatar') {
          let failed = false;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            message.edit({
              content: `${
                failed ? 'The message you sent was not a link.\n' : ''
              }**Send the url to set as the footer's icon.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**`,
              embeds: [],
              components: [],
            });

            const m = (
              await message.channel.awaitMessages({
                filter: (m) => m.author.id === interaction.user.id,
                max: 1,
              })
            ).first();

            if (!m)
              return message.edit({
                content: 'This command has expired.',
                embeds: [],
                components: [],
              });
            m.delete();
            m.content = m.content.trim();
            if (
              m.content.startsWith('http://') ||
              m.content.startsWith('https://') ||
              m.content == '{user:avatar}' ||
              m.content == '{inviter:avatar}' ||
              m.content == '{guild:icon}' ||
              m.content == '{guild:banner}'
            ) {
              if (embedData.footer) embedData.footer.icon = m.content;
              else
                embedData.footer = {
                  text: 'No footer text given. Please set it.',
                  icon: m.content,
                };

              break;
            }

            failed = true;
          }

          updateEmbed(message, embedData, config);
        } else if (interaction.customId == 'removefooter') {
          embedData.footer = undefined;
          updateEmbed(message, embedData, config);
        }
      })
      .catch(() => {
        message.edit({
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      });
  }
  /**
               _   _ _   _ _
             | | | | |_(_) |___
             | | | | __| | / __|
             | |_| | |_| | \__ \
              \___/ \__|_|_|___/

               */
  function generateEmbedFromData(options: Config, embedData: Embed) {
    const replace = (s: string) => {
      return replaceStringVariables(
        s,
        options.user,
        options.guild,
        options.userInvites,
        options.levels,
        options.inviter,
      );
    };

    const embed = new EmbedBuilder();
    if (embedData.title) embed.setTitle(replace(embedData.title));
    if (embedData.url) embed.setURL(replace(embedData.url));

    if (embedData.description) embed.setDescription(replace(embedData.description));

    if (embedData.fields)
      for (let i = 0; i < embedData.fields.length; i++) {
        const field = embedData.fields[i];
        embed.addFields([
          {
            name: replace(field.name),
            value: replace(field.value),
            inline: field.inline,
          },
        ]);
      }

    if (embedData.author) {
      embed.setAuthor({
        name: replace(embedData.author.name),
        iconURL: embedData.author.icon ? replace(embedData.author.icon) : undefined,
      });
    }
    if (embedData.footer)
      embed.setFooter({
        text: replace(embedData.footer.text),
        iconURL: embedData.footer.icon ? replace(embedData.footer.icon) : undefined,
      });

    if (embedData.image) embed.setImage(replace(embedData.image.url));
    if (embedData.thumbnail) embed.setThumbnail(replace(embedData.thumbnail.url));
    if (embedData.color) embed.setColor(embedData.color);
    else if (client.config.colors.normal) embed.setColor(client.config.colors.normal);

    return {
      content: embedData.content ? replace(embedData.content) : undefined,
      embeds: embedData.title || embedData.description || embed.data.image ? [embed] : [],
    };
  }

  function replaceStringVariables(
    s: string,
    user: User,
    guild: Guild,
    userInvites?: {
      invites?: number;
      left?: number;
    },
    levels?: { level: number; xp: number; rank: number },
    inviter?: {
      user?: User;
      invites?: number;
      left?: number;
      levels?: { level: number; xp: number; rank: number };
    },
  ) {
    s = replaceUserVariables(s, user, userInvites, levels, inviter);
    s = replaceGuildVariables(s, guild);
    return s;
  }
  function replaceGuildVariables(s: string, guild: Guild) {
    s = s
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:name}/gm, guild.name)
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:icon}/gm,
        guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
      )
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:owner}/gm, `<@${guild.ownerId}>`)
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:banner}/gm,
        guild.bannerURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
      )
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:tier}/gm, `${guild.premiumTier}`)
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:members}/gm,
        `${guild.approximateMemberCount ?? guild.memberCount ?? 1}`,
      )
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:boosts}/gm, `${guild.premiumSubscriptionCount ?? 0}`)
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:rules}/gm,
        guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : '',
      )
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:description}/gm, `${guild.description ?? 'No description'}`);
    return s;
  }
  function replaceUserVariables(
    s: string,
    user: User,
    userInvites?: {
      invites?: number;
      left?: number;
    },
    levels?: { level: number; xp: number; rank: number },
    inviter?: {
      user?: User;
      invites?: number;
      left?: number;
      levels?: { level: number; xp: number; rank: number };
    },
  ) {
    s = s
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:username}/gm, user.username)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:discriminator}/gm, user.discriminator)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:tag}/gm, `${user.username}#${user.discriminator}`)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:mention}/gm, `<@${user.id}>`)
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:avatar}/gm,
        user.avatarURL({
          extension: 'webp',
        }) ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
      );

    if (userInvites)
      s = s
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:invites}/gm, `${userInvites.invites ?? '0'}`)
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:invites:left}/gm, `${userInvites.left ?? '0'}`);
    s = s
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:level}/gm, `${levels?.level ?? '0'}`)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:xp}/gm, `${levels?.xp ?? '0'}`)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){user:rank}/gm, `${levels?.rank ?? '0'}`);

    //Inviter
    if (inviter) {
      if (inviter.user)
        s = s
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm, inviter.user.username)
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm, inviter.user.discriminator)
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm,
            `${inviter.user.username}#${inviter.user.discriminator}`,
          )
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm, `<@${inviter.user.id}>`)
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm,
            inviter.user.avatarURL({
              extension: 'webp',
            }) ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
          );
      else
        s = s
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm, 'UnkownUser')
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm, '0000')
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm, `UnkownUser#0000`)
          .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm, `UnkownUser`)
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm,
            'https://cdn.discordapp.com/embed/avatars/1.png',
          );
    } else
      s = s
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm, 'UnkownUser')
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm, '0000')
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm, `UnkownUser#0000`)
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm, `UnkownUser`)
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm, 'https://cdn.discordapp.com/embed/avatars/1.png');
    if (userInvites)
      s = s
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:invites}/gm, `${inviter?.invites ?? '0'}`)
        .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:invites:left}/gm, `${inviter?.left ?? '0'}`);
    s = s
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:level}/gm, `${inviter?.levels?.level ?? '0'}`)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:xp}/gm, `${inviter?.levels?.xp ?? '0'}`)
      .replaceAll(/(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:rank}/gm, `${inviter?.levels?.rank ?? '0'}`);

    return s;
  }
  return {
    generateEmbedFromData,
    createComponents,
    createInterface,
    getEmbedConfig,
  };
};

type Embed = {
  content?: string;
  author?: {
    name: string;
    icon?: string;
    url?: string;
  };
  color?: number;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  title?: string;
  url?: string;
  description?: string;
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  footer?: {
    text: string;
    icon?: string;
  };
  callback?: (data: {
    content?: string;
    author?: {
      name: string;
      icon?: string;
      url?: string;
    };
    color?: number;
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
    title?: string;
    url?: string;
    description?: string;
    thumbnail?: {
      url: string;
    };
    image?: {
      url: string;
    };
    footer?: {
      text: string;
      icon?: string;
    };
  }) => unknown;
};

type Config = {
  user: User;
  guild: Guild;
  levels?: { level: number; xp: number; rank: number };
  inviter?: {
    user?: User;
    invites?: number;
    left?: number;
    levels?: { level: number; xp: number; rank: number };
  };
  userInvites?: {
    invites?: number;
    left?: number;
  };
};
