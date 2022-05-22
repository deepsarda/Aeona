const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
const numberParse = require("../../packages/numberparse");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "upgrade",
      description: "upgrade your tool",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
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
    let copy = itemUser;
    if (!itemData.upgradeAble) {
      util.error({
        msg: message,
        title: "This item cannot be upgraded.",
      });
      return;
    }

    //If amount is string
    if (typeof amount === "string") {
      if (amount.toLowerCase() == "all" || amount.toLowerCase() == "max") {
        let level = itemUser.level ? itemUser.level : 1;
        let m = false;
        let cost = 100000;
        let totalLevels = Math.floor(profile.money.wallet / cost);
        let totalCost = cost * totalLevels;
        profile.money.wallet -= totalCost;
        itemUser.level += totalLevels;
        level += totalLevels;
        profile.items.splice(profile.items.indexOf(copy), 1);
        profile.items.push(itemUser);
        await profile.save();
        util.success({
          msg: message,
          title: `You upgraded ${itemData.name} to level ${level}!`,
          description: `You now have ${profile.money.wallet.toLocaleString()} credits.`,
        });
      }
      return;
    }

    let level = itemUser.level ? itemUser.level : 1;
    let max = false;
    for (let i = 0; i < amount; i++) {
      let cost = 100000;
      if (profile.money.wallet < cost) {
        util.error({
          msg: message,
          title: "You don't have enough credits.",
          description: `You need ${(
            cost - profile.money.wallet
          ).toLocaleString()} more credits.`,
        });
        return;
      }
      profile.money.wallet -= cost;
      itemUser.level++;
      level++;
    }

    //Save itemUser
    //remove item from profile

    profile.items.splice(profile.items.indexOf(copy), 1);
    profile.items.push(itemUser);
    await profile.save();

    util.success({
      msg: message,
      title: `You upgraded ${itemData.name} to level ${level}!`,
      description: `You now have ${profile.money.wallet.toLocaleString()} credits.`,
    });
  }
};
