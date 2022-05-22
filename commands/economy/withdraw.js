const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "withdraw",
      description: "withdraw money from your bank",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);
    let amount = numberParse(args[0]);
    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = profile.money.bank;
      }
    }

    if (profile.money.bank < amount) {
      util.error({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.money.bank
        ).toLocaleString()} more coins.`,
      });
      return;
    }

    profile.money.bank -= amount;
    profile.money.wallet += amount;
    profile.save();

    util.success({
      msg: message,
      title: "Withdraw successful.",
      description: `You have withdrawn ${amount.toLocaleString()} credits.`,
    });
  }
};
