const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "buy",
      aliases: [],
      description: "Buy an item",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let item = args[0];
    if (!item)
      return util.error({
        msg: message,
        title: "You need to specify an item!",
        description: "Use `+buy <item>` to buy an item.",
      });

    let amount = numberParse(args[1]);
    if (!amount) amount = 1;

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

    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        amount = Math.floor(profile.money.wallet / itemData.price);
      }
    }
    let cost = itemData.price * amount;

    if (profile.money.wallet < cost) {
      util.error({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          cost - profile.money.wallet
        ).toLocaleString()} more coins.`,
      });
      return;
    }

    if (!itemData.canBuy) {
      util.error({
        msg: message,
        title: "You can't buy this item.",
      });
      return;
    }

    let itemUser = bot.economy.getItemFromArray(profile.items, item);
    if (itemUser) {
      if (itemUser.item.name == itemData.name && itemUser.item.upgradeAble) {
        util.error({
          msg: message,
          title: "You can't buy this item.",
          description: `You already have this item.`,
        });
        return;
      }
    }

    await bot.economy.takeUserCredits(user, cost);
    await bot.economy.giveUserItem(user, itemData.name, amount);

    util.success({
      msg: message,
      title: `You bought ${amount} ${itemData.name}!`,
      description: `You now have ${(
        profile.money.wallet - cost
      ).toLocaleString()} coins.`,
    });
  }
};
