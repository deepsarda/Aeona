const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "buy",
  description: "Buy an item",
  usage: "+buy <item> [amount]",
  category: "economy",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let item = args[0];

    let user = message.member;

    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);

    if (!itemData)
      return await message.replyError({
        msg: message,
        title: "Item not found!",
      });

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

    if (profile.coinsInWallet < cost)
      return await message.replyError({
        msg: message,
        title: "Oops! You're missing some credits!",
        description: `You don't have enough money!\nYou need ${(
          cost - profile.coinsInWallet
        ).toLocaleString()} more credits to buy this item.`,
      });

    if (!itemData.canBuy)
      return await message.replyError({
        msg: message,
        title: "You can't buy this item!",
      });

    let itemUser = bot.economy.getItemFromArray(profile.items, item);
    if (itemUser) {
      if (itemUser.item.name == itemData.name && itemUser.item.upgradeAble)
        return await message.replyError({
          msg: message,
          title: "You can't buy this item!",
          description: `You already have this item.`,
        });
    }

    await bot.economy.takeUserCredits(user, cost);
    await bot.economy.giveUserItem(user, itemData.name, amount);

    await message.reply({
      msg: message,
      title: `You bought ${amount} ${itemData.name}!`,
      description: `You now have ⌭ ${(
        profile.coinsInWallet - cost
      ).toLocaleString()}.`,
    });
  },
};
