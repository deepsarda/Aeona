const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "globalchat",
  description: "Toggle global chat",
  permissions: ["MANAGE_GUILD"],
  usage: "+globalchat <enable|disable> [#channel]",
  category: "Config",
  requiredArgs: 1,
  aliases: ["gc"],
  execute: async (message, args, bot, prefix) => {
    let guild = await Guild.findOne({ guildId: message.guild.id });

    if (args[0] === "setup" || args[0] === "enable") {
      let channel = message.mentions.channels.first()
        ? message.mentions.channels.first()
        : args[1]
        ? message.guild.channels.cache.get(args[1])
        : null;

      if (!channel)
        return message.replyError({
          title: "Oops! You didn't provide a valid channel!",
          description: `Please retry this command... using the correct syntax!\n\n\`${prefix}globalchat <enable|disable> [#channel]\``,
        });

      guild.globalChatChannel = channel.id;
      await guild.save();
      return await message.reply({
        title: "Global chat enabled!",
        description: `Global chat has successfully been enabled in ${channel}.`,
      });
    } else if (args[0] === "disable") {
      guild.globalChatChannel = "";
      await guild.save();
      return message.reply({
        title: "Global chat disabled!",
        description: `Global chat has successfully been disabled.`,
      });
    }

    return message.replyError({
      title: "Oops!",
      description: `Invalid usage!\nPlease retry this command... using the correct syntax!\n\n\`${prefix}globalchat <enable|disable> [#channel]\``,
    });
  },
};
