const Guild = require("../../database/schemas/Guild");
const autoResponse = require("../../database/schemas/autoResponse.js");

module.exports = {
  name: "autoresponselist",
  description: "List of all the auto responses",
  usage: "+autoresponse",
  category: "config",
  aliases: ["ars", "autoresponseslist", "autoresponses"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let autoResponses = await autoResponse.find({
      guildId: message.guild.id,
    });

    if (autoResponses.length === 0)
      return message.replyError({
        title: "Auto Responses",
        description: "There are no auto responses.",
      });

    let data = "";

    for (let i = 0; i < autoResponses.length; i++) {
      data += `${i}. **${autoResponses[i].name}** \n`;
    }

    return message.reply({
      title: "Auto Responses",
      description: data,
    });
  },
};
