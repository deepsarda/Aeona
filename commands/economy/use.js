const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "use",
  description: "Use an item.",
  category: "economy",
  usage: "+use <item> [amount]",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let item = args[0];
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);

    if (!itemData)
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description:
          "That item could not be found!\nPlease retry this command.",
      });

    if (!itemData.canUse)
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description: "You can't use that item!\nPlease retry this command.",
      });

    //find if user has item.
    let itemUser = bot.economy.getItemFromArray(profile.items, itemData.name);
    if (!itemUser)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like you don't have this item!\nPlease retry this command.",
      });

    itemUser = itemUser.item;

    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = itemUser.amount;
      }
    }

    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ title: "Invalid amount!" });

    //Use item
    itemData.run(bot, message, amount, util);

    bot.economy.takeUserItem(user, itemData.name, amount);
  },
};
