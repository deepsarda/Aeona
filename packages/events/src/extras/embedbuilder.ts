import {
  AmethystEmbed,
  Components,
  Context,
} from '@thereallonewolf/amethystframework';
import { Guild, Interaction, Message, User } from 'discordeno/transformers';
import { InteractionResponseTypes } from 'discordeno/types';
import { AeonaBot } from 'extras';

import inviteBy from '../database/models/inviteBy.js';
import invites from '../database/models/invites.js';

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
    const comp = new Components();
    comp.addButton('Set/Delete Title', 'Secondary', 'settitle');
    comp.addButton('Set/Delete Description', 'Secondary', 'setdescription');
    comp.addButton('Set/Delete Image', 'Secondary', 'setimage');
    comp.addButton('Set/Delete Thumbnail', 'Secondary', 'setthumbnail');
    comp.addActionRow();
    comp.addButton('Set/Delete Author', 'Secondary', 'setauthor');
    comp.addButton('Set/Delete Footer', 'Secondary', 'setfooter');
    comp.addButton('Set/Delete Content', 'Secondary', 'setcontent');
    comp.addButton('Set/Delete Color', 'Secondary', 'setcolor');
    comp.addActionRow();
    comp.addButton('Modify Fields', 'Secondary', 'setfields');
    comp.addButton('Save', 'Success', 'sendembed');

    return comp;
  }
  async function fetchData(userId: bigint, guildId: bigint) {
    const user = await client.extras.fetchLevels(userId, guildId);
    const inviteData = await invites.findOne({
      Guild: guildId + '',
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
      user: await client.helpers.getUser(userId),
    };
  }
  async function getEmbedConfig(ctx: Context) {
    const userData = await fetchData(ctx.user!.id, ctx.guildId!);
    const inviter = await inviteBy.findOne({
      Guild: ctx.guildId + '',
      User: ctx.user!.id + '',
    });
    let inviterData;
    if (inviter)
      inviterData = await fetchData(BigInt(inviter.inviteUser!), ctx.guildId!);
    return {
      user: userData.user,
      guild: ctx.guild!,
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
  async function createInterface(
    ctx: Context,
    defaultContent: string,
    embedData: Embed,
  ) {
    if (!embedData.title && !embedData.description)
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

    const config = await getEmbedConfig(ctx);

    const message = (await ctx.reply({ content: 'Loading Embed...' })).message!;
    updateEmbed(message, embedData, config);
  }

  /*
               __  __      _   _               _
             |  \/  | ___| |_| |__   ___   __| |___
             | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
             | |  | |  __/ |_| | | | (_) | (_| \__ \
             |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
             */
  async function updateEmbed(
    message: Message,
    embedData: Embed,
    config: Config,
  ) {
    const embed = generateEmbedFromData(config, embedData);

    const comp = createComponents();
    client.helpers.editMessage(message.channelId, message.id, {
      ...embed,
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === config.user.id;
        },
      })
      .then((interaction) => {
        client.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredUpdateMessage,
          },
        );
        if (interaction.data?.customId == 'setauthor')
          setAuthor(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setfooter')
          setFooter(message, interaction, embedData!, config);

        if (interaction.data?.customId == 'settitle')
          setTitle(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setdescription')
          setDescription(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setcontent')
          setContent(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setimage')
          setImage(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setcolor')
          setColor(message, interaction, embedData, config);

        if (interaction.data?.customId == 'setthumbnail')
          setThumbnail(message, interaction, embedData, config);

        if (interaction.data?.customId == 'sendembed')
          if (embedData.callback) embedData.callback({ ...embedData });

        if (interaction.data?.customId == 'setfields')
          setFields(message, interaction, embedData, config);
      })
      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          components: [],
        });
      });
  }
  async function setTitle(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    client.helpers.editMessage(message.channelId, message.id, {
      content:
        '**Send the title** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = await client.amethystUtils
      .awaitMessage(interaction.user.id, message.channelId)
      .catch();

    if (!m)
      return client.helpers.editMessage(message.channelId, message.id, {
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });
    if (m.content.trim().toLowerCase() == 'cancel') embedData.title = undefined;
    else embedData.title = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setDescription(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    client.helpers.editMessage(message.channelId, message.id, {
      content:
        '**Send the description for the embed.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = await client.amethystUtils
      .awaitMessage(interaction.user.id, message.channelId)
      .catch();

    if (!m)
      return client.helpers.editMessage(message.channelId, message.id, {
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });
    if (m.content.trim().toLowerCase() == 'cancel')
      embedData.description = undefined;
    else embedData.description = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setContent(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    client.helpers.editMessage(message.channelId, message.id, {
      content:
        '**Send the content for the embed.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables` \n :x: To remove it send `cancel`',
      embeds: [],
      components: [],
    });

    const m = await client.amethystUtils
      .awaitMessage(interaction.user.id, message.channelId)
      .catch();

    if (!m)
      return client.helpers.editMessage(message.channelId, message.id, {
        content: 'This command has expired.',
        embeds: [],
        components: [],
      });
    if (m.content.trim().toLowerCase() == 'cancel')
      embedData.content = undefined;
    else embedData.content = m.content;

    updateEmbed(message, embedData, config);
  }
  async function setThumbnail(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      client.helpers.editMessage(message.channelId, message.id, {
        content:
          (failed ? 'The message you sent was not a link.\n' : '') +
          '**Send the url to set as the thumbnail.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**\n :x: To remove it send `cancel`',
        embeds: [],
        components: [],
      });

      const m = await client.amethystUtils
        .awaitMessage(interaction.user.id, message.channelId)
        .catch();

      if (!m)
        return client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
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
  async function setImage(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      client.helpers.editMessage(message.channelId, message.id, {
        content:
          (failed ? 'The message you sent was not a link.\n' : '') +
          '**Send the url to set as the image** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**\n :x: To remove it send `cancel`',
        embeds: [],
        components: [],
      });

      const m = await client.amethystUtils
        .awaitMessage(interaction.user.id, message.channelId)
        .catch();

      if (!m)
        return client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
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
  async function setColor(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    let failed = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      client.helpers.editMessage(message.channelId, message.id, {
        content:
          (failed ? 'The message you sent was not a link.\n' : '') +
          '**Send the hex value to set as the color for the embed.** \n\n <:pInfo:1071022668066865162> This value must be a valid hexadecimal color. Example: #ffffff\n :x: To remove it send `cancel`',
        embeds: [],
        components: [],
      });

      const m = await client.amethystUtils
        .awaitMessage(interaction.user.id, message.channelId)
        .catch();

      if (!m)
        return client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
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

  async function setAuthor(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    const comp = new Components();
    comp
      .addButton('Set Author To User', 'Primary', 'setauthoruser')
      .addButton('Set Author To Inviter', 'Secondary', 'setauthorinviter')
      .addButton('Set Author To Server', 'Secondary', 'setauthorguild')
      .addButton('Set Author Name', 'Secondary', 'setauthorname')
      .addButton('Set Author Avatar', 'Secondary', 'setauthoravatar')
      .addButton('Remove Author', 'Danger', 'removeauthor');
    client.helpers.editMessage(message.channelId, message.id, {
      content: 'Choose your choice from below.',
      embeds: [],
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        client.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredUpdateMessage,
          },
        );
        if (interaction.data?.customId == 'setauthoruser') {
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
        } else if (interaction.data?.customId == 'setauthorinviter') {
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
        } else if (interaction.data?.customId == 'setauthorguild') {
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
        } else if (interaction.data?.customId == 'setauthorname') {
          client.helpers.editMessage(message.channelId, message.id, {
            content:
              '**Send the name of the author.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = await client.amethystUtils
            .awaitMessage(interaction.user.id, message.channelId)
            .catch();

          if (!m)
            return client.helpers.editMessage(message.channelId, message.id, {
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });

          if (!embedData.author)
            embedData.author = {
              name: m.content,
            };
          else embedData.author.name = m.content;

          updateEmbed(message, embedData, config);
        } else if (interaction.data?.customId == 'setauthoravatar') {
          let failed = false;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            client.helpers.editMessage(message.channelId, message.id, {
              content:
                (failed ? 'The message you sent was not a link.\n' : '') +
                "**Send the url to set as the author's avatar.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**",
              embeds: [],
              components: [],
            });

            const m = await client.amethystUtils
              .awaitMessage(interaction.user.id, message.channelId)
              .catch();

            if (!m)
              return client.helpers.editMessage(message.channelId, message.id, {
                content: 'This command has expired.',
                embeds: [],
                components: [],
              });
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
        } else if (interaction.data?.customId == 'removeauthor') {
          embedData.author = undefined;
          updateEmbed(message, embedData, config);
        }
      })
      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
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
    const embed = new AmethystEmbed(true);
    embed.setTitle('Field Visualizer');
    if (index && embedData.fields) {
      embed.addField(
        embedData.fields[index].name,
        embedData.fields[index].value,
        embedData.fields[index].inline,
      );
    } else {
      if (!embedData.fields)
        embedData.fields = [
          {
            name: 'Default Title. Change me.',
            value: 'Default Description. Change Me',
          },
        ];
      embed.addField(
        'Default Title. Change me.',
        'Default Description. Change Me',
      );
    }

    if (!index) index = embedData.fields!.length - 1;
    const comp = new Components();
    comp.addButton('Save Field', 'Success', 'savefield');
    comp.addButton('Change Title', 'Secondary', 'changetitle');
    comp.addButton('Change Description', 'Secondary', 'changedescription');
    comp.addButton('Toggle Inline', 'Secondary', 'toggleinline');
    comp.addButton('Remove Field', 'Danger', 'removefield');

    client.helpers.editMessage(message.channelId, message.id, {
      content: 'Choose your choice from below.',
      embeds: [embed],
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        client.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredUpdateMessage,
          },
        );

        if (interaction.data?.customId == 'savefield')
          updateEmbed(message, embedData, config);
        if (interaction.data?.customId == 'removefield') {
          embedData.fields!.slice(index, 1);
          updateEmbed(message, embedData, config);
        }
        if (interaction.data?.customId == 'changetitle') {
          client.helpers.editMessage(message.channelId, message.id, {
            content:
              '**Send the title of the field.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = await client.amethystUtils
            .awaitMessage(interaction.user.id, message.channelId)
            .catch();

          if (!m)
            return client.helpers.editMessage(message.channelId, message.id, {
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          embedData.fields![0].name = m.content;
          setField(message, interaction, embedData, config);
        }
        if (interaction.data?.customId == 'changedescription') {
          client.helpers.editMessage(message.channelId, message.id, {
            content:
              '**Send the description of the field.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = await client.amethystUtils
            .awaitMessage(interaction.user.id, message.channelId)
            .catch();

          if (!m)
            return client.helpers.editMessage(message.channelId, message.id, {
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });
          embedData.fields![0].value = m.content;
          setField(message, interaction, embedData, config);
        }
      });
  }
  async function setFields(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    const comp = new Components();
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
            value: index + '',
            description: 'modify or delete this field',
          };
        }),
      );

    comp.addSelectComponent(
      'Customise the fields. ',
      'fields',
      options,
      'Customise the fields by choosing from below.',
    );

    client.helpers.editMessage(message.channelId, message.id, {
      content: 'Choose your choice from below.',
      embeds: [],
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        client.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredUpdateMessage,
          },
        );
        if (interaction.data?.values) {
          if (interaction.data?.values[0] == 'add') {
            setField(message, interaction, embedData, config);
          } else {
            setField(
              message,
              interaction,
              embedData,
              config,
              Number(interaction.data?.values[0]),
            );
          }
        }
      })

      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          embeds: [],
          components: [],
        });
      });
  }
  async function setFooter(
    message: Message,
    interaction: Interaction,
    embedData: Embed,
    config: Config,
  ) {
    const comp = new Components();
    comp
      .addButton('Set Footer To User', 'Primary', 'setfooteruser')
      .addButton('Set Footer To Inviter', 'Secondary', 'setfooterinviter')
      .addButton('Set Footer To Server', 'Secondary', 'setfooterguild')
      .addButton('Set Footer Text', 'Secondary', 'setfootername')
      .addButton('Set Footer Avatar', 'Secondary', 'setauthorfooter')
      .addButton('Remove Footer', 'Danger', 'removefooter');
    client.helpers.editMessage(message.channelId, message.id, {
      content: 'Choose your choice from below.',
      embeds: [],
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then(async (interaction) => {
        client.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredUpdateMessage,
          },
        );
        if (interaction.data?.customId == 'setfooteruser') {
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
        } else if (interaction.data?.customId == 'setfooterinviter') {
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
        } else if (interaction.data?.customId == 'setfooterguild') {
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
        } else if (interaction.data?.customId == 'setfootername') {
          client.helpers.editMessage(message.channelId, message.id, {
            content:
              '**Send the text of the footer.** \n <:pInfo:1071022668066865162> To see a list of variables you can use `/embed variables`',
            embeds: [],
            components: [],
          });

          const m = await client.amethystUtils
            .awaitMessage(interaction.user.id, message.channelId)
            .catch();

          if (!m)
            return client.helpers.editMessage(message.channelId, message.id, {
              content: 'This command has expired.',
              embeds: [],
              components: [],
            });

          if (!embedData.footer)
            embedData.footer = {
              text: m.content,
            };
          else embedData.footer.text = m.content;

          updateEmbed(message, embedData, config);
        } else if (interaction.data?.customId == 'setfooteravatar') {
          let failed = false;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            client.helpers.editMessage(message.channelId, message.id, {
              content:
                (failed ? 'The message you sent was not a link.\n' : '') +
                "**Send the url to set as the footer's icon.** \n\n <:pInfo:1071022668066865162> This value must be a **link** or **{user:avatar}** or **{guild:icon}** or **{guild:banner}** or **{inviter:avatar}**",
              embeds: [],
              components: [],
            });

            const m = await client.amethystUtils
              .awaitMessage(interaction.user.id, message.channelId)
              .catch();

            if (!m)
              return client.helpers.editMessage(message.channelId, message.id, {
                content: 'This command has expired.',
                embeds: [],
                components: [],
              });
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
        } else if (interaction.data?.customId == 'removefooter') {
          embedData.footer = undefined;
          updateEmbed(message, embedData, config);
        }
      })
      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
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

    const embed = new AmethystEmbed();
    if (embedData.title)
      embed.setTitle(
        replace(embedData.title),
        embedData.url ? replace(embedData.url) : undefined,
      );

    if (embedData.description)
      embed.setDescription(replace(embedData.description));

    if (embedData.fields)
      for (let i = 0; i < embedData.fields.length; i++) {
        const field = embedData.fields[i];
        embed.addField(replace(field.name), replace(field.value), field.inline);
      }

    if (embedData.author) {
      embed.setAuthor(
        replace(embedData.author.name),
        embedData.author.icon ? replace(embedData.author.icon) : undefined,
      );
    }
    if (embedData.footer)
      embed.setFooter(
        replace(embedData.footer.text),
        embedData.footer.icon ? replace(embedData.footer.icon) : undefined,
      );

    if (embedData.image) embed.setImage(replace(embedData.image.url));
    if (embedData.thumbnail)
      embed.setThumbnail(replace(embedData.thumbnail.url));
    if (embedData.color) embed.setColor(embedData.color.toString(16));
    else embed.setColor(client.extras.config.colors.normal);
    return {
      content: embedData.content ? replace(embedData.content) : undefined,
      embeds: embedData.title || embedData.description ? [embed] : [],
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
        client.helpers.getGuildIconURL(guild.id, guild.icon) ??
          'https://cdn.discordapp.com/embed/avatars/1.png',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:owner}/gm,
        `<@${guild.ownerId}>`,
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:banner}/gm,
        client.helpers.getGuildBannerURL(guild.id, { banner: guild.banner }) ??
          'https://cdn.discordapp.com/embed/avatars/1.png',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:tier}/gm,
        guild.premiumTier + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:members}/gm,
        guild.memberCount + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:boosts}/gm,
        (guild.premiumSubscriptionCount ?? 0) + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:rules}/gm,
        guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){guild:description}/gm,
        (guild.description ?? 'No description') + '',
      );
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
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:discriminator}/gm,
        user.discriminator,
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:tag}/gm,
        `${user.username}#${user.discriminator}`,
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:mention}/gm,
        `<@${user.id}>`,
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:avatar}/gm,
        client.helpers.getAvatarURL(user.id, user.discriminator, {
          avatar: user.avatar,
        }),
      );

    if (userInvites)
      s = s
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:invites}/gm,
          (userInvites.invites ?? '0') + '',
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:invites:left}/gm,
          (userInvites.left ?? '0') + '',
        );
    s = s
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:level}/gm,
        (levels?.level ?? '0') + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:xp}/gm,
        (levels?.xp ?? '0') + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){user:rank}/gm,
        (levels?.rank ?? '0') + '',
      );

    //Inviter
    if (inviter) {
      if (inviter.user)
        s = s
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm,
            inviter.user.username,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm,
            inviter.user.discriminator,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm,
            `${inviter.user.username}#${inviter.user.discriminator}`,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm,
            `<@${inviter.user.id}>`,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm,
            client.helpers.getAvatarURL(
              inviter.user.id,
              inviter.user.discriminator,
              {
                avatar: inviter.user.avatar,
              },
            ),
          );
      else
        s = s
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm,
            'UnkownUser',
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm,
            '0000',
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm,
            `UnkownUser#0000`,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm,
            `UnkownUser`,
          )
          .replaceAll(
            /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm,
            'https://cdn.discordapp.com/embed/avatars/1.png',
          );
    } else
      s = s
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:username}/gm,
          'UnkownUser',
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:discriminator}/gm,
          '0000',
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:tag}/gm,
          `UnkownUser#0000`,
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:mention}/gm,
          `UnkownUser`,
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:avatar}/gm,
          'https://cdn.discordapp.com/embed/avatars/1.png',
        );
    if (userInvites)
      s = s
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:invites}/gm,
          (inviter?.invites ?? '0') + '',
        )
        .replaceAll(
          /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:invites:left}/gm,
          (inviter?.left ?? '0') + '',
        );
    s = s
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:level}/gm,
        (inviter?.levels?.level ?? '0') + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:xp}/gm,
        (inviter?.levels?.xp ?? '0') + '',
      )
      .replaceAll(
        /(?=[^`]*(?:`[^`]*`[^`]*)*$){inviter:rank}/gm,
        (inviter?.levels?.rank ?? '0') + '',
      );

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
