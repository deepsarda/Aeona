const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from your bank account",
  category: "economy",
  usage: "+withdraw [amount]",
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
      return message.replyError({ title: "Invalid amount!" });
    if (profile.coinsInBank < amount) {
      return await message.replyError({
        title: "Oops!",
        description: `Looks like you don't have enough money... you need ⌭ ${(
          amount - profile.coinsInBank
        ).toLocaleString()} more to withdraw!\nPlease retry this command.`,
      });
    }

    profile.coinsInBank -= amount;
    profile.coinsInWallet += amount;
    profile.save();

    message.reply({
      msg: message,
      title: "Credits withdrawn successfully!",
      description: `You withdrew ⌭ ${amount.toLocaleString()} from your bank.`,
      thumbnailURL: "https://img.icons8.com/fluency/344/withdrawal.png",
    });
  },
};
