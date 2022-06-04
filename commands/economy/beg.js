const Discord = require("discord.js");

module.exports = {
  name: "beg",
  description: "Beg for money",
  usage: "+beg",
  category: "economy",
  requiredArgs: 0,
  cooldown: 10,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const random = Math.round(Math.random() * 1000) + 10000;
    const randomMessage = [
      `**Elon Musk** gave you ${random.toLocaleString()} credits.`,
      `**Bill Gates** gave you ${random.toLocaleString()} credits.`,
      `A **beggar** gave you ${random.toLocaleString()} credits.`,
      `Barack Obama gave you ${random.toLocaleString()} credits.`,
    ];
    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];

    bot.economy.giveUserCredits(message.member, random);
    message.reply({
      msg: message,
      title: `You got ${random.toLocaleString()} credits!`,
      description: `${response}`,
    });
  },
};
