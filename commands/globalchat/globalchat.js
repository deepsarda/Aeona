const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "globalchat",
      aliases: ["gc"],
      usage: "setup/disable",
      description: "Setup global chat!",
      category: "globalchat",
      cooldown: 3,
      botPermission: ["MANAGE_WEBHOOKS"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    if (!args || args.length === 0) {
      return message.channel.send(
        `${message.author}, you need to specify a command! \`${guildDB.prefix}globalchat setup [channel]\` or \`${guildDB.prefix}globalchat disable\``
      );
    }

    if (args[0] === "setup") {
      let channel = message.mentions.channels.first()
        ? message.mentions.channels.first()
        : args[1]
        ? message.guild.channels.cache.get(args[1])
        : null;
      if (!channel) {
        return message.channel.send(
          `${message.author}, you need to specify a channel! \`${guildDB.prefix}globalchat setup [channel]\``
        );
      }

      guildDB.globalChatChannel = channel.id;
      await guildDB.save();

      return message.channel.send(
        `${message.author}, global chat has been setup! All messages will now use the channel <#${channel.id}>!`
      );
    } else if (args[0] === "disable") {
      if (guildDB.globalChatChannel === null) {
        return message.channel.send(
          `${message.author}, global chat is already disabled!`
        );
      }

      guildDB.globalChatChannel = null;
      await guildDB.save();
    }
  }
};
