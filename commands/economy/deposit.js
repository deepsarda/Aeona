const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "deposit",
      description: "Deposit credits into your bank.",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let data = profile;

    let amount = numberParse(args[0]);
    if (!amount) amount = 1;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        if (data.money.wallet > data.money.maxBank) {
          const max_deposit =
            data.money.wallet + data.money.bank - data.money.maxBank;

          if (data.money.bank - data.money.maxBank === 0) {
            return util.success({
              msg: message,
              description: `You don't have that much space in your bank. `,
            });
          }

          data.money.wallet = max_deposit;

          data.money.bank =
            data.money.wallet + data.money.maxBank - max_deposit;

          util.success({
            msg: message,
            description: `You now have **${data.money.bank.toLocaleString()}** credits in your bank out of ${data.money.maxBank.toLocaleString()}`,
          });

          await data.save();
        } else {
          if (data.money.wallet + data.money.bank > data.money.maxBank) {
            const left =
              data.money.wallet + data.money.bank - data.money.maxBank;
            util.success({
              msg: message,
              description: `**${user.displayName}** : Deposited **${(
                data.money.wallet - left
              ).toLocaleString()}** credits`,
            });

            data.money.bank += data.money.wallet - left;
            data.money.wallet = left;

            await data.save();
          } else {
            util.success({
              msg: message,
              description: ` **${
                user.displayName
              }** : Deposited **${data.money.wallet.toLocaleString()}** coins`,
            });

            data.money.bank += data.money.wallet;
            data.money.wallet = 0;

            await data.save();
          }
        }
      }

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

    if (amount > profile.money.maxBank - profile.money.maxBank) {
      util.error({
        msg: message,
        title: "You don't have enough space.",
      });
      return;
    }
    profile.money.wallet -= amount;
    profile.money.bank += amount;
    await profile.save();
    util.success({
      msg: message,
      title: "Deposit",
      description: `You deposited ${amount.toLocaleString()} credits into your bank.`,
    });
  }
};
