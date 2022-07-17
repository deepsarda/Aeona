const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "gamble",
  description: "Gamble your money",
  usage: "+gamble [amount](optional)",
  category: "economy",
  requiredArgs: 0,
  aliases: ["bj", "blackjack"],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (profile.passive) {
      message.replyError({
        msg: message,
        title: "You can't use this command while passive.",
      });
      return;
    }

    let amount = numberParse(args[0]);
    if (!amount) amount = 10000;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        amount = profile.coinsInWallet;
      }
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });
    if (isNaN(amount)) {
      message.replyError({
        msg: message,
        title: "Invalid amount.",
      });
      return;
    }
    if (amount > profile.coinsInWallet) {
      message.replyError({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.coinsInWallet
        ).toLocaleString()} more credits.`,
      });
      return;
    }

    if (profile.passive) {
      message.replyError({
        msg: message,
        title: "You can't use this command while passive.",
      });
      return;
    }

    let maxAmount = profile.items.find((x) => x.name.toLowerCase() === "trophy")
      ? 50000000
      : 10000000;

    maxAmount = profile.items.find((x) => x.name.toLowerCase() === "cxldtrophy")
      ? 100000000
      : maxAmount;
    maxAmount = profile.items.find(
      (x) => x.name.toLowerCase() === "sentienttrophy"
    )
      ? 900000000
      : maxAmount;
    maxAmount = profile.items.find(
      (x) => x.name.toLowerCase() === "allegianttrophy"
    )
      ? 100000000000
      : maxAmount;
    maxAmount = profile.items.find(
      (x) => x.name.toLowerCase() === "watchertrophy"
    )
      ? 1000000000000
      : maxAmount;
    if (amount > maxAmount) {
      amount = maxAmount;
    }

    const botRoll = Math.floor(Math.random() * 13) + 1;
    let userChoice = Math.floor(Math.random() * 13) + 1;
    let founditem = profile.items.find((x) => x.name.toLowerCase() === "luck");

    if (founditem) {
      userChoice += 3;
    }

    if (botRoll < userChoice) {
      let winnings = amount + Math.floor(amount * 0.5);
      profile.coinsInWallet += winnings;
      message.reply({
        msg: message,
        title: "You won!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You won ⌭ ${winnings.toLocaleString()}!`,
      });
    } else if (botRoll == userChoice) {
      let winnings = amount / 2;
      profile.coinsInWallet += winnings;
      message.reply({
        msg: message,
        title: "You won!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You won ⌭ ${winnings.toLocaleString()}!`,
      });
    } else {
      profile.coinsInWallet -= amount;
      message.replyError({
        msg: message,
        title: "You lost!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You lost ⌭ ${amount.toLocaleString()}!`,
      });
    }

    await profile.save();
  },
};
