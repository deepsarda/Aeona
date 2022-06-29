const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");

module.exports = {
  name: "questions",
  description: "View the list of questions for this server's applications",
  permissions: ["MANAGE_GUILD"],
  usage: "+questions",
  category: "Applications",
  aliases: ["question"],
  execute: async (message, args, bot, prefix) => {
    let app = await Applications.findOne({ guildId: message.guild.id });

    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.channel.sendError({
        title: "Applications",
        description: `It seems that this server has no applications.`,
      });
    }

    let questions = app.questions;

    if (questions.length === 0) {
      return message.channel.sendError({
        title: "Applications",
        description: `It seems that this server has no questions in thier application.`,
      });
    }

    let text = "";

    for (let i = 0; i < questions.length; i++) {
      text += `${i + 1}. ${questions[i]}\n`;
    }

    return message.channel.send({
      title: "Questions",
      description: text,
    });
  },
};
