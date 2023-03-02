import { AmethystEmbed, Context } from '@thereallonewolf/amethystframework';
import { ActionRow, Channel, Interaction, Message } from 'discordeno';

import config from '../botconfig/bot.js';
import Schema from '../database/models/guild.js';
import embedbuilder from './embedbuilder.js';
import { AeonaBot } from './index.js';

/* Exporting a function that takes a client as a parameter. */
export default (client: AeonaBot) => {
  const templateEmbed = function () {
    return new AmethystEmbed().setColor(config.colors.normal);
  };

  const errNormal = async function (
    {
      embed = templateEmbed(),
      error,
      type,
      content,
      components,
    }: {
      embed?: AmethystEmbed;
      error: string;
      type?: string;
      content?: string;
      components?: ActionRow[];
    },
    interaction: Context | Channel | Interaction,
  ) {
    embed.setTitle(`${config.emotes.normal.error} Error!`);
    embed.setDescription(`Something went wrong!`);
    embed.addField('Error comment', `\`\`\`${error}\`\`\``);
    embed.setColor(config.colors.error);

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
      embed?: AmethystEmbed;
      usage: string;
      type?: string;
      content?: string;
      components?: ActionRow[];
    },
    interaction: Context | Channel | Interaction,
  ) {
    embed.setTitle(`${config.emotes.normal.error} Error!`);
    embed.setDescription(`You did not provide the correct arguments`);
    embed.addField('Required arguments', `\`\`\`${usage}\`\`\``);
    embed.setColor(config.colors.error);

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
      embed?: AmethystEmbed;
      time: number;
      content?: string;
      type?: string;
      components?: ActionRow[];
    },
    interaction: Context | Channel | Interaction,
  ) {
    embed.setTitle(`${config.emotes.normal.error} Error!`);
    embed.setDescription(`You've already done this once`);
    embed.addField('Try again on', `<t:${time}:f>`);
    embed.setColor(config.colors.error);

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
      components?: ActionRow[];
      type?: string;
      footer?: string;
      embed?: AmethystEmbed;
    },
    interaction: Context | Channel | Interaction,
  ) {
    if (interaction.guildId == undefined) interaction.guildId = 0n;
    const functiondata = await Schema.findOne({ Guild: interaction.guildId });

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048)
      embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    if (author) embed.setAuthor(author.name!, author.iconURL);
    if (url) embed.url = url;
    if (footer) embed.setFooter(footer);
    if (color) embed.setColor(color);
    if (functiondata && functiondata.Color && !color)
      embed.setColor(functiondata.Color);

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
      components?: ActionRow[];
      type?: string;
    },
    interaction: Context | Channel | Interaction,
  ) {
    const functiondata = await Schema.findOne({ Guild: interaction.guildId });

    const embed = new AmethystEmbed().setColor(config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048)
      embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    if (author) embed.setAuthor(author.name!, author.iconURL);
    if (url) embed.url = url;
    if (color) embed.setColor(color);
    if (functiondata && functiondata.Color && !color)
      embed.setColor(functiondata.Color);

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
      components?: ActionRow[];
    },
    ctx: Message,
  ) {
    const functiondata = await Schema.findOne({ Guild: ctx.guildId });

    const embed = new AmethystEmbed().setColor(config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048)
      embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    if (author) embed.setAuthor(author.name!, author.iconURL);
    if (url) embed.url = url;
    if (color) embed.setColor(color);
    if (functiondata && functiondata.Color && !color)
      embed.setColor(functiondata.Color);
    return await client.helpers
      .sendMessage(ctx.channelId, {
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
      components?: ActionRow[];
    },
    ctx: Message,
  ) {
    const functiondata = await Schema.findOne({ Guild: ctx.guildId });

    const embed = new AmethystEmbed().setColor(config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048)
      embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    if (author) embed.setAuthor(author.name!, author.iconURL);
    if (footer) embed.setFooter(footer);
    if (url) embed.url = url;
    if (color) embed.setColor(color);
    if (functiondata && functiondata.Color && !color)
      embed.setColor(functiondata.Color);

    return await client.helpers
      .editMessage(ctx.channelId, `${ctx.id}`, {
        embeds: [embed],
        content,
        components,
      })
      .catch();
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
      embed?: AmethystEmbed;
      text?: string;
      fields?: {
        name: string;
        value: string;
        inline?: boolean;
      }[];
      content?: string;
      components?: ActionRow[];
      type?: string;
    },
    interaction: Context | Channel | Interaction,
  ) {
    embed.setTitle(`${client.extras.emotes.normal.check}・Success!`);
    embed.setDescription(`${text}`);
    embed.setColor(client.extras.config.colors.succes);

    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    type = 'reply';
    return client.extras.sendEmbed(
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
      components?: ActionRow[];
    },
    ctx: Message,
  ) {
    const functiondata = await Schema.findOne({ Guild: ctx.guildId });

    const embed = new AmethystEmbed().setColor(config.colors.normal);

    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048)
      embed.setDescription(`${desc.substr(0, 2044)}...`);
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields)
      for (const field of fields)
        embed.addField(field.name, field.value, field.inline);
    if (author) embed.setAuthor(author.name!, author.iconURL);
    if (url) embed.url = url;
    if (color) embed.setColor(color);
    if (functiondata && functiondata.Color && !color)
      embed.setColor(functiondata.Color);

    return await client.helpers
      .sendMessage(ctx.channelId, {
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
      embeds: AmethystEmbed[];
      content?: string;
      components?: ActionRow[];
      type?: string;
    },
    ctx: Context | Channel | Interaction,
  ) {
    if (ctx instanceof Context) {
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
          if (embed.author == undefined)
            embed.setAuthor(
              'Aeona',
              'https://www.aeona.xyz/logo.png',
              'https://docs.aeona.xyz',
            );
          if (embed.footer == undefined)
            embed.setFooter(
              ctx.user
                ? `Requested by ${ctx.user.username}#${ctx.user.discriminator} | +perks`
                : '',

              client.helpers.getAvatarURL(
                ctx.user!.id,
                ctx.user!.discriminator,
                {
                  avatar: ctx.user?.avatar,
                },
              ),
            );
        } catch (e) {
          //
        }
      }
      // Generate a random number between 1 to 10;
      const randomNumber = Math.floor(Math.random() * 50);
      content =
        randomNumber == 0
          ? (content ?? '') + s[0]
          : randomNumber == 1
            ? (content ?? '') + s[1]
            : content;
      if (type && type.toLowerCase() == 'reply' && ctx.replied) {
        const c = await ctx
          .reply({
            embeds,
            content,
            components,
            fetchReply: true,
          })
          .catch();

        return c.message!;
      }
      if (type && type.toLowerCase() == 'reply') {
        const c = await ctx
          .reply({
            embeds,
            content,
            components,
            fetchReply: true,
          })
          .catch();
        return c.message!;
      }
      if (type && type.toLowerCase() == 'editreply') {
        const c = await ctx
          .editReply({
            embeds,
            content,
            components,
            fetchReply: true,
          })
          .catch();
        return c.message!;
      }
      if (type && type.toLowerCase() == 'ephemeral') {
        const c = await ctx
          .reply({
            embeds,
            content,
            components,
            fetchReply: true,
            ephemeral: true,
            private: true,
          })
          .catch();
        return c.message!;
      }
      if (type && type.toLowerCase() == 'ephemeraledit') {
        const c = await ctx
          .editReply({
            embeds,
            content,
            components,
            fetchReply: true,
            ephemeral: true,
            private: true,
          })
          .catch();
        return c.message!;
      }
      const c = await ctx
        .reply({
          embeds,
          content,
          components,
          fetchReply: true,
        })
        .catch();
      return c.message!;
    }

    for (const embed of embeds) {
      try {
        if (embed.author == undefined)
          embed.setAuthor(
            'Aeona',
            'https://www.aeona.xyz/logo.png',
            'https://docs.aeona.xyz',
          );
      } catch (e) {
        //
      }
    }
    return await client.helpers
      .sendMessage(ctx.id, {
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
    succNormal,
  };
};
