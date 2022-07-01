const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "anti-links",
  description: "Stop user's from using links",
  usage: "+anti-links <enable | disable>",
  category: "config",
  requiredArgs: 1,
  aliases: ["anti-link", "antilink", "antilink"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    let option = args[0].toLowerCase();
    if (option === "enable") {
      guild.antiLinks = true;
      await guild.save();
      return message.channel.send({
        title: "Anti Links",
        description: `Anti-links has been enabled.`,
      });
    }

    if (option === "disable") {
      guild.antiLinks = false;
      await guild.save();
      return message.channel.send({
        title: "Anti Links",
        description: `Anti-links has been disabled.`,
      });
    }

    return message.channel.sendError({
      title: "Anti Links",
      description: `Please provide a valid argument. \n Valid arguments: \n enable \n disable`,
    });
  },
};
