import { AmethystEmbed, Components, Context } from '@thereallonewolf/amethystframework';
import { Guild, Interaction, Message, User } from 'discordeno/transformers';
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
    comp.addButton('Set/Delete Footer', 'Secondary', 'setfooter');
    comp.addButton('Set/Delete Color', 'Secondary', 'setcolor');
    comp.addActionRow();
    comp.addButton('Set/Delete Author', 'Secondary', 'setauthor');
    comp.addButton('Set/Delete Thumbnail', 'Secondary', 'setthumbnail');
    comp.addButton('Set/Delete Url', 'Secondary', 'seturl');
    comp.addButton('Set/Delete Content', 'Secondary', 'setcontent');
    comp.addActionRow();
    comp.addButton('Add Field', 'Secondary', 'addfield');
    comp.addButton('Remove Field', 'Secondary', 'removefield');
    comp.addActionRow();
    comp.addButton('Send/Edit Embed', 'Success', 'sendembed');
    comp.addButton('Save/Delete Embed', 'Danger', 'saveembed');
    comp.addButton('Load Saved Embed', 'Primary', 'loadembed');

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
    embedData?: Embed,
  ) {
    if (!embedData)
      embedData = {
        content: defaultContent,
        title: 'Variables for you to use.',
        description: `
        <:F_txt1:1049288903263277086><:ayyy:1056627813286952980>  **User Variables**
        <:F_txt2:1049288870199566366> __Variable <:F_Arrow:1049291677359153202> Description <:F_Arrow:1049291677359153202> Example__
        <:F_txt2:1049288870199566366> \`{user:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {user:username}
        <:F_txt2:1049288870199566366> \`{user:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {user:discriminator}
        <:F_txt2:1049288870199566366> \`{user:tag}\` <:F_Arrow:1049291677359153202> User's Tag<:F_Arrow:1049291677359153202> {user:tag}
        <:F_txt2:1049288870199566366> \`{user:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {user:mention}
        <:F_txt2:1049288870199566366> \`{user:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {user:invites}
        <:F_txt2:1049288870199566366> \`{user:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {user:invites:left}
        <:F_txt2:1049288870199566366> \`{user:level}\` <:F_Arrow:1049291677359153202> User's level<:F_Arrow:1049291677359153202> {user:level}
        <:F_txt2:1049288870199566366> \`{user:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {user:xp}
        <:F_txt2:1049288870199566366> \`{user:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {user:rank}
        <:F_txt2:1049288870199566366> \`{user:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
        <:F_txt4:1049288828646588547> <:YaeSmug:1062031989714198678> **Inviter Variables** *The user who invited the user*
        <:F_txt2:1049288870199566366> \`{inviter:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {inviter:username}
        <:F_txt2:1049288870199566366> \`{inviter:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {inviter:discriminator}
        <:F_txt2:1049288870199566366> \`{inviter:tag}\` <:F_Arrow:1049291677359153202> User's Tag <:F_Arrow:1049291677359153202> {inviter:tag}
        <:F_txt2:1049288870199566366> \`{inviter:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {inviter:mention}
        <:F_txt2:1049288870199566366> \`{inviter:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {inviter:invites}
        <:F_txt2:1049288870199566366> \`{inviter:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {inviter:invites:left}
        <:F_txt2:1049288870199566366> \`{inviter:level}\` <:F_Arrow:1049291677359153202> User's level <:F_Arrow:1049291677359153202> {inviter:level}
        <:F_txt2:1049288870199566366> \`{inviter:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {inviter:xp}
        <:F_txt2:1049288870199566366> \`{inviter:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {inviter:rank}
        <:F_txt2:1049288870199566366> \`{inviter:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
        <:F_txt4:1049288828646588547> <:AH_LoveCat:1050681792060985414> **Server Variables**
        <:F_txt2:1049288870199566366> \`{guild:name}\` <:F_Arrow:1049291677359153202> Server's Name <:F_Arrow:1049291677359153202> {guild:name}
        <:F_txt2:1049288870199566366> \`{guild:owner}\` <:F_Arrow:1049291677359153202> Ping to the server's owner <:F_Arrow:1049291677359153202> {guild:owner}
        <:F_txt2:1049288870199566366> \`{guild:tier}\` <:F_Arrow:1049291677359153202> Server's boosting tier <:F_Arrow:1049291677359153202> {guild:tier}
        <:F_txt2:1049288870199566366> \`{guild:description}\` <:F_Arrow:1049291677359153202> Server's description <:F_Arrow:1049291677359153202> {guild:description}
        <:F_txt2:1049288870199566366> \`{guild:boosts}\` <:F_Arrow:1049291677359153202>The number of boosts this server has <:F_Arrow:1049291677359153202>3 {guild:boosts}
        <:F_txt2:1049288870199566366> \`{guild:rules}\` <:F_Arrow:1049291677359153202> The ping of the channel setup for rules <:F_Arrow:1049291677359153202> {guild:rules}
        <:F_txt2:1049288870199566366> \`{guild:icon}\` <:F_Arrow:1049291677359153202> Link to server's icon
        <:F_txt3:1049288938017267773> \`{guild:banner}\` <:F_Arrow:1049291677359153202> Link to server's banner
        `,
      };
    const userData = await fetchData(ctx.user!.id, ctx.guildId!);
    const inviter = await inviteBy.findOne({
      Guild: ctx.guildId + '',
      User: ctx.user!.id + '',
    });
    let inviterData;
    if (inviter)
      inviterData = await fetchData(BigInt(inviter.inviteUser!), ctx.guildId!);
    const config = {
      user: userData.user,
      guild: ctx.guild!,
      inviter: inviterData,
      levels: userData.levels,
      userInvites: { invites: userData.invites, left: userData.left },
    };

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
    const embed = generateEmbed(config, embedData);

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
        if (interaction.data?.customId == 'setauthor') {
          setAuthor(message, interaction, embedData!, config);
        }
      })
      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
          components: [],
        });
      });
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
      .addButton('Set Author Name', 'Secondary', 'setauthorname')
      .addButton('Set Author Avatar', 'Secondary', 'setauthoravatar')
      .addButton('Set Url', 'Secondary', 'setauthorurl');
    client.helpers.editMessage(message.channelId, message.id, {
      content: 'Choose your choice from below.',
      components: comp,
    });

    client.amethystUtils
      .awaitComponent(message.id, {
        filter(bot, data) {
          return data.user.id === interaction.user.id;
        },
      })
      .then((interaction) => {
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
              name: '{user:tag}',
              icon: '{user:avatar}',
            };
          else {
            embedData.author.name = '{user:tag}';
            embedData.author.icon = '{user:avatar}';
          }

          updateEmbed(message, embedData, config);
        }
      })
      .catch(() => {
        client.helpers.editMessage(message.channelId, message.id, {
          content: 'This command has expired.',
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
  function generateEmbed(options: Config, embedData: Embed) {
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

    if (embedData.footer)
      embed.setFooter(
        replace(embedData.footer.text),
        embedData.footer.icon ? replace(embedData.footer.icon) : undefined,
      );

    if (embedData.image) embed.setImage(replace(embedData.image));
    if (embedData.thumbnail) embed.setDescription(replace(embedData.thumbnail));
    if (embedData.color) embed.setColor(embedData.color);
    else embed.setColor(client.extras.config.colors.normal);
    return {
      content: embedData.content ? replace(embedData.content) : undefined,
      embeds: [embed],
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
    generateEmbed,
    createComponents,
    createInterface,
  };
};

type Embed = {
  content?: string;
  author?: {
    name: string;
    icon?: string;
    url?: string;
  };
  color?: string;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  title?: string;
  url?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  footer?: {
    text: string;
    icon?: string;
  };
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
