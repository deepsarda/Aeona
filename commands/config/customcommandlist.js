const Guild = require("../../database/schemas/Guild");
const customCommand = require("../../database/schemas/customCommand.js");

module.exports = {
  name: "customcommandlist",
  description: "List all custom commands",
  usage: "+customcommandlist",
  category: "config",
  aliases: ["ccl"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let customcommandlist = await customCommand.find({
      guildId: message.guild.id,
    });

    if (customcommandlist.length === 0) {
      return message.replyError({
        title: "Custom Command",
        description: "There are no custom commands to list.",
      });
    }

    let description = "";

    for (let i = 0; i < customcommandlist.length; i++) {
      description += `**${i + 1}.** ${customcommandlist[i].name}\n`;
    }

    return message.reply({
      title: "Custom Command List",
      description: description,
    });
  },
};
