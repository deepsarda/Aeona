const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from your bank account",
  category: "economy",
  usage: "+withdraw [amount](optional)",
  requiredArgs: 0,
  aliases: ["with"],
  execute: async (message, args, bot, prefix) => {
    let amount = numberParse(args[0]);
    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = profile.coinsInBank;
      }
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });
    if (profile.coinsInBank < amount) {
      message.replyError({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.coinsInBank
        ).toLocaleString()} more coins.`,
      });
      return;
    }

    profile.coinsInBank -= amount;
    profile.coinsInWallet += amount;
    profile.save();

    message.reply({
      msg: message,
      title: "Withdraw successful.",
      description: `You have withdrawn ${amount.toLocaleString()} credits.`,
    });
  },
};
