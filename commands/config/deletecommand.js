const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "deletecommand",
  description: "Delete a custom command",
  usage: "+deletecommand <command name>",
  category: "config",
  aliases: [],
  requiredArgs: 1,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let name = args[0].toLowerCase();
    let customCommand = await customCommand.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (!customCommand)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like there's no custom command with this name!\nPlease retry this command.",
      });

    await customCommand.deleteOne({
      guildId: message.guild.id,
      name: name,
    });

    await message.reply({
      title: "Custom command successfully deleted!",
      description: `The custom command \`${name}\` has been deleted!\n\nYou can create a new one using \`${prefix}cc <name> <response>\`.`,
    });
  },
};
