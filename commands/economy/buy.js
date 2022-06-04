const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "buy",
  description: "Buy an item",
  usage: "+buy [item] [amount](optional)",
  category: "economy",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let item = args[0];
    if (!item)
      return message.replyError({
        msg: message,
        title: "You need to specify an item!",
        description: "Use `+buy <item>` to buy an item.",
      });

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);
    if (!itemData) {
      message.replyError({
        msg: message,
        title: "Item not found.",
      });
      return;
    }
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;

    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = Math.floor(profile.coinsInWallet / itemData.price);
      }
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });

    let cost = itemData.price * amount;

    if (profile.coinsInWallet < cost) {
      message.replyError({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          cost - profile.coinsInWallet
        ).toLocaleString()} more coins.`,
      });
      return;
    }

    if (!itemData.canBuy) {
      message.replyError({
        msg: message,
        title: "You can't buy this item.",
      });
      return;
    }

    let itemUser = bot.economy.getItemFromArray(profile.items, item);
    if (itemUser) {
      if (itemUser.item.name == itemData.name && itemUser.item.upgradeAble) {
        message.replyError({
          msg: message,
          title: "You can't buy this item.",
          description: `You already have this item.`,
        });
        return;
      }
    }

    await bot.economy.takeUserCredits(user, cost);
    await bot.economy.giveUserItem(user, itemData.name, amount);

    message.reply({
      msg: message,
      title: `You bought ${amount} ${itemData.name}!`,
      description: `You now have ${(
        profile.coinsInWallet - cost
      ).toLocaleString()} coins.`,
    });
  },
};
