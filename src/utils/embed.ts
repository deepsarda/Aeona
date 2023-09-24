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

/**
 * Initializes utility functions for sending embed messages and error messages.
 *
 * @function
 *
 * @param {AeonaBot} client - The client object.
 *
 * @returns {object} An object containing utility functions.
 */
export default (client: AeonaBot) => {
  /**
   * Utility function to return a basic template embed message setup with default fields and colors as specified in the client
   * configuration.
   *
   * @function
   *
   * @returns {EmbedBuilder} A basic embed message setup with default fields and colors.
   */
  const templateEmbed = function (): EmbedBuilder {
    const embed = new EmbedBuilder();
    if (client.config.colors.normal) embed.setColor(client.config.colors.normal);
    return embed;
  };

  /**
   * Utility function to create and send an error message with title; description; an error message field with contents as
   * provided; with also the color specified for error messages in the client configuration.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {EmbedBuilder} options.embed - An optional embed to be used instead of the default template embed message.
   * @param {string} options.error - The error message that would be added to the embed.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send an error message stating that the command was not used correctly, with the correct syntax specified.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {EmbedBuilder} options.embed - An optional embed to be used instead of the default template embed message.
   * @param {string} options.usage - The correct usage of the command which would be displayed in the message.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send an error message stating that the user should wait before sending commands again.
   *
   * @function
   *
   * @param {object} options An object containing options for the utility functions.
   * @param {EmbedBuilder} options.embed - An optional embed to be used instead of the default template embed message.
   * @param {string} options.time - The time in seconds that the user should wait before sending commands again.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send an embed message with customizable attributes like title, subtitle, thumbnail, color, etc.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {string} options.title - The title of the embed message to send.
   * @param {string} options.desc - The subtitle of the embed message to send.
   * @param {string} options.color - The color of the embed message to send.
   * @param {string} options.image - The image network url link of the embed message to send.
   * @param {object} options.author - The author of the embed message containing only the author's name and image url link.
   * @param {string} options.url - A url link to attach to the title of the embed message.
   * @param {string} options.footer - Custom text to add to the footer of the embed message.
   * @param {string} options.thumbnail - Link to the thumbnail to use for the embed message.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {EmbedBuilder} options.embed - An optional embed to be used instead of the default template embed message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send a simple message containing an embed with some customizable messages.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {string} options.title - The title of the embed message to send.
   * @param {string} options.desc - The subtitle of the embed message to send.
   * @param {string} options.color - The color of the embed message to send.
   * @param {string} options.image - The image network url link of the embed message to send.
   * @param {object} options.author - The author of the embed message containing only the author's name and image network url link.
   * @param {string} options.thumbnail - Link to the thumbnail to use for the embed message.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.url - A url link to attach to the title of the embed message.
   * @param {string} options.content - The content of the message to send.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {string} options.footer - Custom text to add to the footer of the embed message.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send a simple message containing an embed with some customizable messages.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {string} options.title - The title of the embed message to send.
   * @param {string} options.desc - The subtitle of the embed message to send.
   * @param {string} options.color - The color of the embed message to send.
   * @param {string} options.image - The image network url link of the embed message to send.
   * @param {object} options.author - The author of the embed message containing only the author's name and image network url link.
   * @param {string} options.thumbnail - Link to the thumbnail to use for the embed message.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.url - A url link to attach to the title of the embed message.
   * @param {string} options.content - The content of the message to send.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to edit an embed message with customizable attributes like title, subtitle, thumbnail, color, etc.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {string} options.title - The title of the embed message to edit.
   * @param {string} options.desc - The subtitle of the embed message to edit.
   * @param {string} options.color - The color of the embed message to edit.
   * @param {string} options.image - The image network url link of the embed message to edit.
   * @param {object} options.author - The author of the embed message containing only the author's name and image url link.
   * @param {string} options.thumbnail - Link to the thumbnail to use for the embed message.
   * @param {string} options.footer - Custom text to add to the footer of the embed message.
   * @param {string} options.url - A url link to attach to the title of the embed message.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.content - An optional string to include in the edit message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the edit message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} ctx - An interaction object which is either a command interaction, a simple command message or a text channel to send the edit message to.
   *
   * @returns {Promise<Message>} A promise that contains the edited message.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to create and send a success message with customizable attributes like title, fields, etc.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {EmbedBuilder} options.embed - An optional embed to be used instead of the default template embed message.
   * @param {string} options.text - The success message that would be added to the embed.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to send an embed message to a text channel.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {string} options.title - The title of the embed message to send.
   * @param {string} options.desc - The subtitle of the embed message to send.
   * @param {string} options.color - The color of the embed message to send.
   * @param {string} options.image - The image network url link of the embed message to send.
   * @param {object} options.author - The author of the embed message containing only the author's name and image network url link.
   * @param {string} options.thumbnail - Link to the thumbnail to use for the embed message.
   * @param {object[]} options.fields - An array of field object that contain name, value, and whether the field is inline or not.
   * @param {string} options.url - A url link to attach to the title of the embed message.
   * @param {string} options.content - The content of the message to send.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} interaction - An interaction object which is either a command interaction, a simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
  ): Promise<Message> {
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

  /**
   * Utility function to send an embed message to an interaction or a text channel.
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @param {EmbedBuilder[]} options.embeds - An array of embeds to be sent.
   * @param {string} options.content - An optional string to include in the message.
   * @param {ActionRowBuilder[]} options.components - An optional array of message components like buttons or select dropdowns to include in the message.
   * @param {string} options.type - An optional string to specify the type of interaction to use `reply`, `editreply` or `ephemeral`.
   * @param {CommandInteraction | SimpleCommandMessage | TextChannel} ctx - An interaction object which is either a command interaction, simple command message or a text channel to send the message to.
   *
   * @returns {Promise<Message>} A promise that contains the message sent.
   */
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
        await ctx
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
        await ctx
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

      await ctx
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
  /**
   * Utility function to create a embed..
   *
   * @function
   *
   * @param {object} options - An object containing options for the utility functions.
   * @returns {EmbedBuilder} The created embed.
   */
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
