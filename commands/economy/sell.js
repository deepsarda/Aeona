const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "sell",
  description: "Sell your items.",
  category: "economy",
  usage: "+sell <item> <amount>",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    var user = message.member;
    var profile = await bot.economy.getConfig(user);
    let item1 = args[0];
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        item1 = null;
        amount = 1;
      }
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });

    if (!item1) {
      let moneyEarned = 0;
      let description = "";
      let itemsSold = 0;

      //Loop through all the items in the profile
      for (let i = 0; i < profile.items.length; i++) {
        let item = profile.items[i];
        let itemData = bot.economy.getItem(item.name);
        if (itemData.autosell) {
          moneyEarned += itemData.sellAmount * item.amount;
          description +=
            itemData.emote +
            item.name +
            " x " +
            item.amount.toLocaleString() +
            "\n";
          itemsSold += item.amount;
          profile.items.splice(i, 1);
          i--;
        }
      }
      profile.coinsInWallet += moneyEarned;
      await profile.save();
      message.reply({
        msg: message,
        title: "Sold Items",
        description:
          "You sold " +
          itemsSold.toLocaleString() +
          " items for " +
          moneyEarned.toLocaleString() +
          " coins.\n" +
          description,
      });
      return;
    }
    let itemData = await bot.economy.getItem(item1);
    if (!itemData) {
      message.replyError({
        msg: message,
        title: "Item not found.",
      });
      return;
    }

    //find if user has item.
    let itemUser = bot.economy.getItemFromArray(profile.items, itemData.name);
    if (!itemUser) {
      message.replyError({
        msg: message,
        title: "You don't have this item.",
      });
      return;
    }
    itemUser = itemUser.item;
    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = itemUser.amount;
      }
    }

    if (itemUser.amount < amount) {
      message.replyError({
        msg: message,
        title: "You don't have enough of this item.",
        description: `You need ${(
          amount - itemUser.amount
        ).toLocaleString()} more of this item.`,
      });
      return;
    }

    let sell = itemData.sellAmount * amount;
    profile.coinsInWallet += sell;
    await profile.save();
    bot.economy.takeUserItem(message.member, itemData.name, amount);

    message.reply({
      msg: message,
      title: "Success!",
      description: `You sold ${amount} ${
        itemData.name
      } for ${sell.toLocaleString()} credits.`,
    });
  },
};
