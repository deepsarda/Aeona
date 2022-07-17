const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");

module.exports = {
  name: "applyLog",
  description: "Set's the guild's apply Logs",
  permissions: ["MANAGE_GUILD"],
  usage: "+applyLog enable #channel | disable",
  category: "Applications",
  requiredArgs: 1,
  aliases: ["applychannel", "applylogs"],
  execute: async (message, args, bot, prefix) => {
    let option = args[0];

    if (option === "enable") {
      let channel = message.mentions.channels.first()
        ? message.mentions.channels.first()
        : message.guild.channels.cache.find((c) => c.name === args[1])
        ? message.guild.channels.cache.find((c) => c.name === args[1])
        : message.guild.channels.cache.find((c) => c.id === args[1]);

      if (!channel) {
        return message.channel.replyError({
          title: "Applications",
          description: `Could not find the channel. Please make sure you have the right channel name or ID. \`+applyLog enable #channel\``,
        });
      }

      let app = await Applications.findOne({ guildID: message.guild.id });

      if (!app) {
        app = new Applications({
          guildID: message.guild.id,
          questions: [],
          appToggle: false,
          appLogs: channel.id,
        });
        await app.save();
        return message.channel.reply({
          title: "Applications",
          description: `All set! The channel is now set to ${channel} for applications. To disable it, use \`+applyLog disable\`. \n You can also add questions to the list by using \`+addquestions <question>\`.`,
        });
      }

      app.appLogs = channel.id;
      await app.save();
      return message.channel.reply({
        title: "Applications",
        description: `All set! The channel is now set to ${channel} for applications. To disable it, use \`+applyLog disable\`. \n You can also add questions to the list by using \`+addquestions <question>\`.`,
      });
    } else if (option === "disable") {
      let app = await Applications.findOne({ guildId: message.guild.id });

      if (!app) {
        return message.channel.replyError({
          title: "Applications",
          description: `There are no applications to disable.`,
        });
      }

      app.appLogs = " ";
      await app.save();
      return message.channel.reply({
        title: "Applications",
        description: `All set! The channel is now set to disabled. To enable it, use \`+applyLog enable <channel> \`. `,
      });
    } else {
      return message.channel.replyError({
        title: "Applications",
        description: `Invalid option. Valid options are: enable, disable`,
      });
    }
  },
};
