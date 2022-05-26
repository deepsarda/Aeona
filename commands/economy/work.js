const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "work",
      description: "Do a job",
      category: "economy",
      cooldown: 1,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    let replies = [
      "Programmer",
      "Builder",
      "Waiter",
      "Busboy",
      "Chief",
      "Mechanic",
    ];
    let result = Math.floor(Math.random() * replies.length);
    let amount = Math.floor(Math.random() * 15000) + 100000;
    util.success({
      msg: message,
      description: ` You worked as a ${replies[result]} and earned ${amount} credits`,
    });

    profile.money.wallet += amount;
    profile.save();
  }
};
