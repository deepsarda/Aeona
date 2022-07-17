const Applications = require("../../database/schemas/application.js");

module.exports = {
  name: "remquestions",
  description: "Remove a question from the application",
  permissions: ["MANAGE_GUILD"],
  usage: "+remquestions <question ID>",
  category: "Applications",
  aliases: ["removequestion"],
  requiredArgs: 1,
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

    let number = Number(args[0]);

    if (!number || number < 1 || number > app.questions.length) {
      return message.replyError({
        title: "Applications",
        description: `Please provide a valid question ID.`,
      });
    }

    let questions = app.questions;

    questions.splice(number - 1, 1);

    app.questions = questions;

    await app.save();

    return message.reply({
      title: "Applications",
      description: `Question ${number} has been removed.`,
    });
  },
};
