const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "use",
      description: "Use an item",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let item = args[0];
    let amount = numberParse(args[1]);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    let itemData = await bot.economy.getItem(item);
    if (!itemData) {
      util.error({
        msg: message,
        title: "Item not found.",
      });
      return;
    }

    if (!itemData.canUse) {
      util.error({
        msg: message,
        title: "You can't use this item.",
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

    //Use item
    itemData.run(bot, message, amount, util);

    bot.economy.takeUserItem(user, itemData.name, amount);
  }
};
