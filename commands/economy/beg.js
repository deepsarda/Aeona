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
      `**Elon Musk** gave you ⌭ ${random.toLocaleString()}.`,
      `**Bill Gates** gave you ⌭ ${random.toLocaleString()}.`,
      `A **beggar** gave you ⌭ ${random.toLocaleString()}.`,
      `Barack Obama gave you ⌭ ${random.toLocaleString()}.`,
    ];
    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];

    bot.economy.giveUserCredits(message.member, random);

    message.reply({
      msg: message,
      title: `You begged on and the streets and got`,
      description: `${response}`,
    });
  },
};
