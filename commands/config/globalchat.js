const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "globalchat",
  description: "Toggle global chat",
  permissions: ["MANAGE_GUILD"],
  usage: "+globalchat setup/disable",
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
          title: "Global Chat",
          description: `Please provide a valid channel. \n Valid arguments: \n setup #channel`,
        });

      guild.globalChatChannel = channel.id;
      await guild.save();
      return message.reply({
        title: "Global Chat",
        description: `Global chat has been enabled.`,
      });
    } else if (args[0] === "disable") {
      guild.globalChatChannel = "";
      await guild.save();
      return message.reply({
        title: "Global Chat",
        description: `Global chat has been disabled.`,
      });
    }

    return message.replyError({
      title: "Global Chat",
      description: `Please provide a valid argument. \n Valid arguments: \n setup #channel \n disable`,
    });
  },
};
