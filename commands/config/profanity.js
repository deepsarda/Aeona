const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "profanity-check",
  description: "Auto-deletes all messages deemed as profanity by an AI checker",
  usage: "+profanity-check <enable|disable>",
  category: "config",
  requiredArgs: 1,
  aliases: [],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false")
      return message.replyError({
        title: "Profanity",
        description: `This server is not premium. You can't use this command. \n Check out aeona premium [here](${process.env.domain}/premium).`,
      });

    if (args[0] === "enable") {
      guild.aiAutoMod = true;
      await guild.save();
      return message.reply({
        title: "Profanity Checker",
        description: `Profanity-checker has been enabled.`,
      });
    }

    if (args[0] === "disable") {
      guild.aiAutoMod = false;
      await guild.save();
      return message.reply({
        title: "Profanity Checker",
        description: `Profanity-checker has been disabled.`,
      });
    }

    await message.replyError({
      title: "Oops!",
      description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}profanity-check <enable|disable>\``,
    });
  },
};
