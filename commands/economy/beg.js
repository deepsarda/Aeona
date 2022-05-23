const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "beg",
      description: "beg for money",
      category: "economy",
      cooldown: 10,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

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
    util.success({
      msg: message,
      title: `You got ${random.toLocaleString()} credits!`,
      description: `${response}`,
    });
  }
};
