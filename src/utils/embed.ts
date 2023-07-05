import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  HexColorString,
  Message,
  MessageActionRowComponentBuilder,
  TextChannel,
} from 'discord.js';
import Schema from '../database/models/guild.js';
import embedbuilder from './embedbuilder.js';
import { AeonaBot } from './types.js';
import { SimpleCommandMessage } from 'discordx';


export default (client: AeonaBot) => {
  const templateEmbed = function () {
    const embed = new EmbedBuilder();
    if (client.config.colors.normal) embed.setColor(client.config.colors.normal);
    return embed;
  };

  const errNormal = async function (
    {
      embed = templateEmbed(),
      error,
      type,
      content,
      components,
    }: {
      embed?: EmbedBuilder;
      error: string;
      type?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    embed.setTitle(`${client.config.emotes.normal.error} Error!`);
    embed.setDescription(`Something went wrong!`);
    embed.addFields([
      {
        name: 'Error comment',
        value: `\`\`\`${error}\`\`\``,
      },
    ]);
    embed.setColor(client.config.colors.error);

    return await sendEmbed(
      {
        embeds: [embed],
        content,
        components,
        type,
      },
      interaction,
    );
  };

  const errUsage = async function (
    {
      embed = templateEmbed(),
      usage,
      type,
      content,
      components,
    }: {
      embed?: EmbedBuilder;
      usage: string;
      type?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    embed.setTitle(`${client.config.emotes.normal.error} Error!`);
    embed.setDescription(`You did not provide the correct arguments`);
    embed.addFields([
      {
        name: 'Correct usage',
        value: `\`\`\`${usage}\`\`\``,
      },
    ]);

    embed.setColor(client.config.colors.error);

    return await sendEmbed(
      {
        embeds: [embed],
        content,
        components,
        type,
      },
      interaction,
    );
  };

  const errWait = async function (
    {
      embed = templateEmbed(),
      time,
      type,
      content,
      components,
    }: {
      embed?: EmbedBuilder;
      time: number;
      content?: string;
      type?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    embed.setTitle(`${client.config.emotes.normal.error} Error!`);
    embed.setDescription(`You've already done this once`);
    embed.addFields([
      {
        name: 'Try again in',
        value: `<t:${time}:f>`,
      },
    ]);

    embed.setColor(client.config.colors.error);

    return await sendEmbed(
      {
        embeds: [embed],
        content,
        components,
        type,
      },
      interaction,
    );
  };

  const embed = async function (
    {
      embed = templateEmbed(),
      title,
      desc,
      color,
      image,
      author,
      url,
      footer,
      thumbnail,
      fields,
      content,
      components,
      type,
    }: {
      title?: string;
      desc?: string;
      color?: string;
      image?: string;
      author?: {
        name?: string;
        iconURL?: string;
      };
      thumbnail?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      url?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
      type?: string;
      footer?: string;
      embed?: EmbedBuilder;
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);
    if (footer)
      embed.setFooter({
        text: footer,
      });
    if (color) embed.setColor(color as unknown as HexColorString);

    return await sendEmbed(
      {
        embeds: title || desc || image ? [embed] : [],
        content,
        components,
        type,
      },
      interaction,
    );
  };

  const createEmbed = function ({
    embed = templateEmbed(),
    title,
    desc,
    color,
    image,
    author,
    url,
    footer,
    thumbnail,
    fields,
    content,
    components,
    type,
  }: {
    title?: string;
    desc?: string;
    color?: string;
    image?: string;
    author?: {
      name?: string;
      iconURL?: string;
    };
    thumbnail?: string;
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
    url?: string;
    content?: string;
    components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    type?: string;
    footer?: string;
    embed?: EmbedBuilder;
  }) {
    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);
    if (footer)
      embed.setFooter({
        text: footer,
      });
    if (color) embed.setColor(color as unknown as HexColorString);

    return embed;
  };

  const simpleEmbed = async function (
    {
      title,
      desc,
      color,
      image,
      author,
      thumbnail,
      fields,
      url,
      content,
      components,
      footer,
      type,
    }: {
      title?: string;
      desc?: string;
      color?: string;
      image?: string;
      author?: {
        name?: string;
        iconURL?: string;
      };
      thumbnail?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      url?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
      footer?: string;
      type?: string;
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    const embed = new EmbedBuilder().setColor(client.config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);
    if (footer)
      embed.setFooter({
        text: footer,
      });
    if (color) embed.setColor(color as unknown as HexColorString);

    return await sendEmbed(
      {
        embeds: [embed],
        content,
        components,
        type,
      },
      interaction,
    );
  };

  const simpleMessageEmbed = async function (
    {
      title,
      desc,
      color,
      image,
      author,
      thumbnail,
      fields,
      url,
      content,
      components,
    }: {
      title?: string;
      desc?: string;
      color?: string;
      image?: string;
      author?: {
        name?: string;
        iconURL?: string;
      };
      thumbnail?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      url?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    ctx: Message,
  ) {
    const embed = new EmbedBuilder().setColor(client.config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);

    if (color) embed.setColor(color as unknown as HexColorString);

    return await ctx.channel
      .send({
        embeds: [embed],
        content,

        components,
      })
      .catch();
  };

  const editEmbed = async function (
    {
      title,
      desc,
      color,
      image,
      author,
      thumbnail,
      footer,
      fields,
      url,
      content,
      components,
    }: {
      title?: string;
      desc?: string;
      color?: string;
      image?: string;
      author?: {
        name?: string;
        iconURL?: string;
      };
      thumbnail?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      url?: string;
      content?: string;
      footer?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    ctx: Message,
  ) {
    const embed = new EmbedBuilder();
    if (client.config.colors.normal) embed.setColor(client.config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);
    if (footer)
      embed.setFooter({
        text: footer,
      });
    if (color) embed.setColor(color as unknown as HexColorString);

    return await ctx.edit({
      embeds: [embed],
      content,
      components,
    });
  };
  const succNormal = async function (
    {
      embed = templateEmbed(),
      text,
      fields,
      type,
      content,
      components,
    }: {
      embed?: EmbedBuilder;
      text?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
      type?: string;
    },
    interaction: SimpleCommandMessage | CommandInteraction | TextChannel,
  ) {
    embed.setTitle(`${client.config.emotes.normal.check}・Success!`);
    embed.setDescription(`${text}`);

    if (fields) embed.addFields(fields);
    type = 'reply';
    return sendEmbed(
      {
        embeds: [embed],
        content,
        components,
        type,
      },
      interaction,
    );
  };
  const sendEmbedMessage = async function (
    {
      title,
      desc,
      color,
      image,
      author,
      thumbnail,
      fields,
      url,
      content,
      components,
    }: {
      title?: string;
      desc?: string;
      color?: string;
      image?: string;
      author?: {
        name?: string;
        iconURL?: string;
      };
      thumbnail?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      url?: string;
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    },
    ctx: Message,
  ) {
    const embed = new EmbedBuilder();
    if (client.config.colors.normal) embed.setColor(client.config.colors.normal);
    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor({ name: author.name!, iconURL: author.iconURL! });
    if (url) embed.setURL(url);
    if (color) embed.setColor(color as unknown as HexColorString);

    return await ctx
      .reply({
        embeds: [embed],
        content,
        components,
      })
      .catch();
  };
  const sendEmbed = async function (
    {
      embeds,
      content,
      components,
      type,
    }: {
      embeds: EmbedBuilder[];
      content?: string;
      components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
      type?: string;
    },
    ctx: SimpleCommandMessage | CommandInteraction | TextChannel,
  ): Promise<Message> {
    if (ctx instanceof SimpleCommandMessage) {
      let s = [
        '\n discord.gg/W8hssA32C9',
        '\n Upvote me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote',
      ];
      let guildDB = await Schema.findOne({ Guild: `${ctx.message.guildId}` });
      if (!guildDB)
        guildDB = new Schema({
          Guild: `${ctx.message.guildId}`,
        });
      if (guildDB.isPremium === 'true') s = ['', ''];

      for (const embed of embeds) {
        try {
          if (embed.data.footer == undefined)
            embed.setFooter({
              text: ctx.message.author
                ? `Requested by ${ctx.message.author.username}#${ctx.message.author.discriminator} | +perks`
                : '',
              iconURL: ctx.message.author.avatarURL() ?? undefined,
            });
        } catch (e) {
          //
        }
      }
      // Generate a random number between 1 to 10;
      const randomNumber = Math.floor(Math.random() * 50);
      content = randomNumber == 0 ? (content ?? '') + s[0] : randomNumber == 1 ? (content ?? '') + s[1] : content;
      if (type && type.toLowerCase() == 'reply') {
        const c = await ctx.message
          .reply({
            embeds,
            content,
            components,
          })
          .catch();

        return c;
      }
      if (type && type.toLowerCase() == 'editreply') {
        const c = await ctx.message
          .edit({
            embeds,
            content,
            components,
          })
          .catch();
        return c;
      }
      if (type && type.toLowerCase() == 'ephemeral') {
        const c = await ctx.message
          .reply({
            embeds,
            content,
            components,
          })
          .catch();
        setTimeout(() => {
          c.delete();
        }, 10 * 1000);
        return c;
      }
      if (type && type.toLowerCase() == 'ephemeraledit') {
        const c = await ctx.message
          .edit({
            embeds,
            content,
            components,
          })
          .catch();
        setTimeout(() => {
          c.delete();
        }, 10 * 1000);
        return c;
      }
      const c = await ctx.message
        .reply({
          embeds,
          content,
          components,
        })
        .catch();
      return c;
    } else if (ctx instanceof CommandInteraction) {
      let s = [
        '\n discord.gg/W8hssA32C9',
        '\n Upvote me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote',
      ];
      let guildDB = await Schema.findOne({ Guild: `${ctx.guildId}` });
      if (!guildDB)
        guildDB = new Schema({
          Guild: `${ctx.guildId}`,
        });
      if (guildDB.isPremium === 'true') s = ['', ''];

      for (const embed of embeds) {
        try {
          if (embed.data.footer == undefined)
            embed.setFooter({
              text: ctx.user ? `Requested by ${ctx.user.username}#${ctx.user.discriminator} | +perks` : '',
              iconURL: ctx.user.avatarURL() ?? undefined,
            });
        } catch (e) {
          //
        }
      }
      // Generate a random number between 1 to 10;
      const randomNumber = Math.floor(Math.random() * 50);
      content = randomNumber == 0 ? (content ?? '') + s[0] : randomNumber == 1 ? (content ?? '') + s[1] : content;
      if (type && type.toLowerCase() == 'reply' && ctx.deferred && !ctx.replied) {
        const c = await ctx
          .editReply({
            embeds,
            content,
            components,
          })
          .catch();

        return c;
      }
      if (type && type.toLowerCase() == 'reply' && ctx.replied) {
        const c = await ctx
          .followUp({
            embeds,
            content,
            components,
          })
          .catch();

        return c;
      }
      if (type && type.toLowerCase() == 'reply') {
        const c = await ctx
          .reply({
            embeds,
            content,
            components,
          })
          .catch();
        return ctx.fetchReply();
      }
      if (type && type.toLowerCase() == 'editreply') {
        const c = await ctx
          .editReply({
            embeds,
            content,
            components,
          })
          .catch();
        return c;
      }
      if (type && type.toLowerCase() == 'ephemeral') {
        const c = await ctx
          .reply({
            embeds,
            content,
            components,
            ephemeral: true,
          })
          .catch();

        return ctx.fetchReply();
      }

      if (type && type.toLowerCase() == 'ephemeraledit')
        return await ctx
          .editReply({
            embeds,
            content,
            components,
          })
          .catch();

      const c = await ctx
        .reply({
          embeds,
          content,
          components,
        })
        .catch();
      return ctx.fetchReply();
    }

    return await ctx
      .send({
        embeds,
        content,
        components,
      })
      .catch();
  };

  // Return all the functions
  const builders = embedbuilder(client);
  return {
    ...builders,
    templateEmbed,
    errNormal,
    errUsage,
    errWait,
    embed,
    simpleEmbed,
    simpleMessageEmbed,
    editEmbed,
    sendEmbedMessage,
    sendEmbed,
    createEmbed,
    succNormal,
  };
};
