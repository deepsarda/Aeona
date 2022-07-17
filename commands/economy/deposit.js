const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "deposit",
  description: "Deposit credits into your bank account",
  usage: "+deposit [amount]",
  category: "economy",
  requiredArgs: 0,
  aliases: ["dep"],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let data = profile;

    const depositURL = "https://img.icons8.com/color-glass/344/deposit.png";

    let amount = numberParse(args[0]);
    if (!amount) amount = 1;

    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        if (data.coinsInWallet > data.bankSpace) {
          const max_deposit =
            data.coinsInWallet + data.coinsInBank - data.bankSpace;

          if (data.coinsInBank - data.bankSpace === 0)
            return await message.replyError({
              msg: message,
              title: `You don't have that much space in your bank!`,
            });

          data.coinsInWallet = max_deposit;

          data.coinsInBank = data.coinsInWallet + data.bankSpace - max_deposit;

          await message.reply({
            msg: message,
            title: "Credits deposited successfully!",
            // description: `You now have **⌭ ${data.coinsInBank.toLocaleString()}** in your bank out of ⌭ ${data.bankSpace.toLocaleString()}`,
            description: `You deposited ⌭ ${max_deposit}.`,
            thumbnailURL: depositURL,
          });

          await data.save();
        } else {
          if (data.coinsInWallet + data.coinsInBank > data.bankSpace) {
            const left = data.coinsInWallet + data.coinsInBank - data.bankSpace;

            await message.reply({
              msg: message,
              title: "Credits deposited successfully!",
              description: `You deposited ⌭ ${(
                data.coinsInWallet - left
              ).toLocaleString()}.`,
              thumbnailURL: depositURL,
            });

            data.coinsInBank += data.coinsInWallet - left;
            data.coinsInWallet = left;

            await data.save();
          } else {
            await message.reply({
              msg: message,
              title: "Credits deposited successfully!",
              description: `You deposited ⌭ ${data.coinsInWallet.toLocaleString()}.`,
              thumbnailURL: depositURL,
            });

            data.coinsInBank += data.coinsInWallet;
            data.coinsInWallet = 0;

            await data.save();
          }
        }
      }

      return;
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });

    if (amount > profile.coinsInWallet)
      return await message.replyError({
        msg: message,
        title: "You don't have enough credits!",
        description: `You need ${(
          amount - profile.coinsInWallet
        ).toLocaleString()} more credits.`,
      });

    if (amount > profile.bankSpace - profile.coinsInBank)
      return await message.replyError({
        msg: message,
        title: "You don't have enough space!",
      });

    profile.coinsInWallet -= amount;
    profile.coinsInBank += amount;
    await profile.save();

    await message.reply({
      msg: message,
      title: "Credits deposited successfully!",
      description: `You deposited ⌭ ${amount.toLocaleString()} into your bank.`,
      thumbnailURL: depositURL,
    });
  },
};
