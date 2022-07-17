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
      return message.reply({
        title: "Anti Links",
        description: `Anti-links has been enabled.`,
      });
    }

    if (option === "disable") {
      guild.antiLinks = false;
      await guild.save();
      return message.reply({
        title: "Anti Links",
        description: `Anti-links has been disabled.`,
      });
    }

    await message.replyError({
      title: "Oops!",
      description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}anti-links <enable|disable>\``,
    });
  },
};
