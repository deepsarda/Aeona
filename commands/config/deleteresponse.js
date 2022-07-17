const autoResponse = require("../../database/schemas/autoResponse.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "deleteautoresponse",
  description: "Delete an auto response",
  usage: "+deleteautoresponse <command name>",
  category: "config",
  requiredArgs: 1,
  aliases: ["dar"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let name = args[0].toLowerCase();
    let autoResponse = await autoResponse.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (!autoResponse)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like there's no auto-responder for this message!\nPlease retry this command.",
      });

    await autoResponse.deleteOne({
      guildId: message.guild.id,
      name: name,
    });

    return message.reply({
      title: "Auto Response",
      description: "The auto response has been deleted.",
    });
    await message.reply({
      title: "Auto-responder successfully deleted!",
      description: `The auto-responder for the message \`${name}\` has been deleted!\n\nYou can create a new one using \`${prefix}ar <message> <response>\`.`,
    });
  },
};
