const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");

module.exports = {
  name: "apply",
  description: "Apply in the current servers, or answer a few questions",
  permissions: ["MANAGE_GUILD"],
  usage: "+apply",
  category: "Applications",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let guild = await Guild.findOne({ guildId: message.guild.id });

    let app = await Applications.findOne({ guildID: message.guild.id });

    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.channel.replyError({
        title: "Applications",
        description: `It seems that this server has no applications.`,
      });
    }

    if (!app.appLogs)
      return message.channel.replyError({
        title: "Applications",
        description:
          "It seems that this server has no channel setup for applications.",
      });

    let channel = await bot.channels.fetch(app.appLogs).catch(() => {
      return message.channel.replyError({
        title: "Applications",
        description: `It seems that this server has no channel setup for applications.`,
      });
    });

    if (!channel)
      return message.channel.replyError({
        title: "Applications",
        description:
          "It seems that this server application log channel does not exist anymore.",
      });

    return message.channel.reply({
      title: "Applications",
      description: `You can now apply to this server [by clicking here](${process.env.domain}/apply/${message.guild.id}).`,
    });
  },
};
