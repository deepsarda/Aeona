const Guild = require("../../database/schemas/Guild");
const customCommand = require("../../database/schemas/customCommand.js");

module.exports = {
  name: "customcommandlist",
  description: "List all custom commands",
  usage: "+customcommandlist",
  category: "config",
  requiredArgs: 0,
  aliases: ["ccl"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let customcommandlist = await customCommand.find({
      guildId: message.guild.id,
    });

    if (customcommandlist.length === 0) {
      return message.replyError({
        title: "Custom command List",
        description: `Welp, you haven't added any custom commands yet!\n\nCreate a custom command using \`${prefix}cc <name> <response>\``,
      });
    }

    let data = "";

    for (const [i, c] of customcommandlist.entries()) {
      data += `\`${i + 1}.\` **${c.name}**\n`;
    }

    return message.reply({
      title: "Auto-responder List",
      description: data,
    });
  },
};
