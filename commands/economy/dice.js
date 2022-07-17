const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "dice",
  description: "Roll a dice",
  usage: "+dice [amount]",
  category: "economy",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let amount = numberParse(args[0]);
    if (!amount) amount = 10000;

    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        amount = profile.coinsInWallet;
      }
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return await message.replyError({
        msg: message,
        title: "Invalid amount!",
      });

    if (amount > profile.coinsInWallet) {
      return await message.replyError({
        msg: message,
        title: "You don't have enough money!",
        description: `You need ${(
          amount - profile.coinsInWallet
        ).toLocaleString()} more credits.`,
      });
    }

    if (profile.passive)
      return await message.replyError({
        msg: message,
        title: "You can't use this command while passive!",
      });

    const diceURL = "https://img.icons8.com/fluency/344/dice.png";

    const botRoll = Math.floor(Math.random() * 7) + 1;
    const userChoice = Math.floor(Math.random() * 7) + 1;

    if (botRoll < userChoice) {
      let winnings = amount + Math.floor(amount * 0.5);
      profile.coinsInWallet += winnings;
      message.reply({
        msg: message,
        title: "You won the game!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}.\nYou won ⌭ ${winnings.toLocaleString()}!`,
        thumbnailURL: diceURL,
      });
    } else if (botRoll == userChoice) {
      let winnings = amount / 2;
      profile.coinsInWallet += winnings;
      message.reply({
        msg: message,
        title: "You won the game!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}.\nYou won ⌭ ${winnings.toLocaleString()}!`,
        thumbnailURL: diceURL,
      });
    } else {
      profile.coinsInWallet -= amount;
      message.replyError({
        msg: message,
        title: "You lost the game!",
        description: `You rolled a ${userChoice} and the bot rolled a ${botRoll}.\nYou lost ⌭ ${amount.toLocaleString()}!`,
        thumbnailURL: diceURL,
      });
    }

    await profile.save();
  },
};
