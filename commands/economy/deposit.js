const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "deposit",
  description: "Deposit money into your bank account",
  usage: "+deposit [amount](optional)",
  category: "economy",
  requiredArgs: 0,
  aliases: ["dep"],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let data = profile;

    let amount = numberParse(args[0]);
    if (!amount) amount = 1;

    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        if (data.coinsInWallet > data.bankSpace) {
          const max_deposit =
            data.coinsInWallet + data.coinsInBank - data.bankSpace;

          if (data.coinsInBank - data.bankSpace === 0) {
            return message.reply({
              msg: message,
              description: `You don't have that much space in your bank. `,
            });
          }

          data.coinsInWallet = max_deposit;

          data.coinsInBank =
            data.coinsInWallet + data.bankSpace - max_deposit;

          message.reply({
            msg: message,
            description: `You now have **${data.coinsInBank.toLocaleString()}** credits in your bank out of ${data.bankSpace.toLocaleString()}`,
          });

          await data.save();
        } else {
          if (data.coinsInWallet + data.coinsInBank > data.bankSpace) {
            const left =
              data.coinsInWallet + data.coinsInBank - data.bankSpace;
            message.reply({
              msg: message,
              description: `**${user.displayName}** : Deposited **${(
                data.coinsInWallet - left
              ).toLocaleString()}** credits`,
            });

            data.coinsInBank += data.coinsInWallet - left;
            data.coinsInWallet = left;

            await data.save();
          } else {
            message.reply({
              msg: message,
              description: ` **${
                user.displayName
              }** : Deposited **${data.coinsInWallet.toLocaleString()}** coins`,
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

    if (amount > profile.bankSpace - profile.bankSpace) {
      message.replyError({
        msg: message,
        title: "You don't have enough space.",
      });
      return;
    }
    profile.coinsInWallet -= amount;
    profile.coinsInBank += amount;
    await profile.save();
    message.reply({
      msg: message,
      title: "Deposit",
      description: `You deposited ${amount.toLocaleString()} credits into your bank.`,
    });
  },
};
