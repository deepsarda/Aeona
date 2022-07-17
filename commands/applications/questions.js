const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");

module.exports = {
  name: "questions",
  description: "View the list of questions for this server's applications",
  permissions: ["MANAGE_GUILD"],
  usage: "+questions",
  category: "Applications",
  aliases: ["question"],
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let app = await Applications.findOne({ guildID: message.guild.id });

    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.replyError({
        title: "Applications",
        description: `It seems that this server has no applications.`,
      });
    }

    let questions = app.questions;

    console.log(questions);
    let text = "";

    for (let i = 0; i < questions.length; i++) {
      text += `${i + 1}. ${questions[i]}\n`;
    }

    return message.reply({
      title: "Questions",
      description: text,
    });
  },
};
