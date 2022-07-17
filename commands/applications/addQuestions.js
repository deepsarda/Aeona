const Guild = require("../../database/schemas/Guild");
const Applications = require("../../database/schemas/application.js");
const Discord = require("discord.js");

module.exports = {
  name: "addquestions",
  description:
    "Add questions to the list and when you apply they will be there",
  permissions: ["MANAGE_GUILD"],
  usage: "+addquestions <question>",
  category: "Applications",
  requiredArgs: 1,
  aliases: ["addquestion", "applicationquestions", "appquestions"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });
    let maxQuestions = 10;
    if (guild.isPremium === true) maxQuestions = 25;

    let app = await Applications.findOne({ guildID: message.guild.id });
    let question = args.join(" ");
    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [question],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.channel.reply({
        title: "Applications",
        description: `Question added: ${question}`,
      });
    }

    if (app.questions.length >= maxQuestions) {
      return message.channel.replyError({
        title: "Applications",
        description: `You can only have ${maxQuestions} questions.`,
      });
    }

    app.questions.push(question);
    await app.save();
    return message.channel.reply({
      title: "Applications",
      description: `Question added: ${question}`,
    });
  },
};
