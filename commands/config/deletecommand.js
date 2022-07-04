const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "deletecommand",
  description: "Delete a custom command",
  usage: "+deletecommand <command name>",
  category: "config",
  aliases: [],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let name = args[0].toLowerCase();
    let customCommand = await customCommand.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (!customCommand)
      return message.replyError({
        title: "Custom Command",
        description: "A custom command with this name does not exist.",
      });

    await customCommand.deleteOne({
      guildId: message.guild.id,
      name: name,
    });

    return message.reply({
      title: "Custom Command",
      description: "The custom command has been deleted.",
    });
  },
};
