const Guild = require("../../database/schemas/Guild");
const autoResponse = require("../../database/schemas/autoResponse.js");

module.exports = {
  name: "autoresponselist",
  description: "List of all the auto responses",
  usage: "+autoresponselist",
  category: "config",
  aliases: ["ars", "autoresponseslist", "autoresponses"],
  requiredArgs: 0,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let autoResponses = await autoResponse.find({
      guildId: message.guild.id,
    });

    if (autoResponses.length === 0)
      return await message.replyError({
        title: "Auto-responder List",
        description: `Welp, you haven't added any auto-responders yet!\n\nCreate an auto-responder using \`${prefix}ar <message> <response>\``,
      });

    let data = "";

    for (const [i, ar] of autoResponses.entries()) {
      data += `\`${i + 1}.\` **${ar.name}** → ${ar.content}\n`;
    }

    return message.reply({
      title: "Auto-responder List",
      description: data,
    });
  },
};
