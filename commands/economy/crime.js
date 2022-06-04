const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "crime",
  description: "Commit a crime",
  usage: "+crime",
  category: "economy",
  requiredArgs: 0,
  cooldown: 10 * 60,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const random = Math.round(Math.random() * 1000) + 10000;
    const randomMessage = [
      `You assassinated **Bill Gates** you was payed ${random.toLocaleString()} credits.`,
      `You stole from a poor old grannie and she only had ${random.toLocaleString()} credits.`,
      `You raided a drug dealers home and found ${random.toLocaleString()} credits.`,
      `You murdered **Donald Trump** you was payed ${random.toLocaleString()} credits.`,
      `You almost got shot, but you had **GODMODE** enabled and killed him you was payed ${random.toLocaleString()} credits.`,
      `You stole from a rich old grannie and she only had ${random.toLocaleString()} credits.`,
      `You robbed a bank and got ${random.toLocaleString()} credits.`,
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
