const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "use",
  description: "Use an item.",
  category: "economy",
  usage: "+use [item] [amount](optional)",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let item = args[0];
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;
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

    if (!itemData.canUse) {
      message.replyError({
        msg: message,
        title: "You can't use this item.",
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

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });

    //Use item
    itemData.run(bot, message, amount, util);

    bot.economy.takeUserItem(user, itemData.name, amount);
  },
};
