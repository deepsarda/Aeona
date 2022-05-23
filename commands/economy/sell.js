const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "sell",
      description: "Sell an item.",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
    var user = message.member;
    var profile = await bot.economy.getConfig(user);
    let item1 = args[0];
    let amount = numberParse(args[1]);
    if (!amount) amount = 1;
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
      profile.money.wallet += moneyEarned;
      await profile.save();
      util.success({
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
      util.error({
        msg: message,
        title: "Item not found.",
      });
      return;
    }

    //find if user has item.
    let itemUser = bot.economy.getItemFromArray(profile.items, itemData.name);
    if (!itemUser) {
      util.error({
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
      util.error({
        msg: message,
        title: "You don't have enough of this item.",
        description: `You need ${(
          amount - itemUser.amount
        ).toLocaleString()} more of this item.`,
      });
      return;
    }

    let sell = itemData.sellAmount * amount;
    profile.money.wallet += sell;
    await profile.save();
    bot.economy.takeUserItem(message.member, itemData.name, amount);

    util.success({
      msg: message,
      title: "Success!",
      description: `You sold ${amount} ${
        itemData.name
      } for ${sell.toLocaleString()} credits.`,
    });
  }
};
