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

    let app = await Applications.findOne({ guildId: message.guild.id });

    if (!app) {
      app = new Applications({
        guildID: message.guild.id,
        questions: [args[0]],
        appToggle: false,
        appLogs: " ",
      });
      await app.save();
      return message.channel.send({
        title: "Applications",
        description: `Question added: ${args[0]}`,
      });
    }

    if (app.questions.length >= maxQuestions) {
      return message.channel.sendError({
        title: "Applications",
        description: `You can only have ${maxQuestions} questions.`,
      });
    }

    app.questions.push(args[0]);
    await app.save();
    return message.channel.send({
      title: "Applications",
      description: `Question added: ${args[0]}`,
    });
  },
};
