const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "gamble",
      description: "Gamble your money and try winning big!",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (profile.passive) {
      util.error({
        msg: message,
        title: "You can't use this command while passive.",
      });
      return;
    }

    let amount = numberParse(args[0]);
    if (!amount) amount = 10000;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        amount = profile.money.wallet;
      }
    }
    if (isNaN(amount)) {
      util.error({
        msg: message,
        title: "Invalid amount.",
      });
      return;
    }
    if (amount > profile.money.wallet) {
      util.error({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.money.wallet
        ).toLocaleString()} more credits.`,
      });
      return;
    }

    if (profile.passive) {
      util.error({
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
      profile.money.wallet += winnings;
      util.success({
        msg: message,
        title: "You won!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You won ${winnings.toLocaleString()} credits!`,
      });
    } else if (botRoll == userChoice) {
      let winnings = amount / 2;
      profile.money.wallet += winnings;
      util.success({
        msg: message,
        title: "You won!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You won ${winnings.toLocaleString()} credits!`,
      });
    } else {
      profile.money.wallet -= amount;
      util.error({
        msg: message,
        title: "You lost!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}. You lost ${amount.toLocaleString()} credits!`,
      });
    }
  }
};
