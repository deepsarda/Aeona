const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "crime",
      description: "Commit a crime",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);

    let user = message.member;

    const random = Math.round(Math.random() * 1000) + 10000;
    const randomMessage = [
      `You assassinated **Bill Gates** you was payed ${random.toLocaleString()} credits.`,
      `You stole from a poor old grannie and she only had ${random.toLocaleString()} credits.`,
      `You raided a drug dealers home and found ${random.toLocaleString()} credits.`,
      `You murdered **Donald Trump** you was payed ${random.toLocaleString()} credits.`,
      `You almost got shot, but you had **GODMODE** enabled and killed him you was payed ${random.toLocaleString()} credits.`,
    ];
    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];

    bot.economy.giveUserCredits(message.member, random);
    util.success({
      msg: message,
      title: `You got ${random.toLocaleString()} credits!`,
      description: `${response}`,
    });
  }
};
