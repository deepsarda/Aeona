const autoResponse = require("../../database/schemas/autoResponse.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "deleteautoresponse",
  description: "Delete an auto response",
  usage: "+deleteautoresponse <command name>",
  category: "config",
  aliases: ["dar"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let name = args[0].toLowerCase();
    let autoResponse = await autoResponse.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (!autoResponse)
      return message.replyError({
        title: "Auto Response",
        description: "An auto response with this name does not exist.",
      });

    await autoResponse.deleteOne({
      guildId: message.guild.id,
      name: name,
    });

    return message.reply({
      title: "Auto Response",
      description: "The auto response has been deleted.",
    });
  },
};
