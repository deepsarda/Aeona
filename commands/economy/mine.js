const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "",
      description: "",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
    var user = message.member;
    var profile = await bot.economy.getConfig(user);
    let data = await bot.economy.getConfig(message.member);
    let founditem = data.items.find((x) => x.name.toLowerCase() === "pickaxe");

    if (!founditem) {
      return util.error({
        msg: message,
        title: "Oops!",
        description: `You don't own a pickaxe yet!\nUse \`${prefix}buy pickaxe\` to buy one, before using this command.`,
      });
    }
    let itemLevel = founditem.level;

    if (!itemLevel) {
      itemLevel = 0;
    }

    const randomMessage = [
      "missed",
      "missed",
      "missed",
      "d",
      "d",
      "d",
      "d",
      "d",
      "r",
      "r",
      "r",
      "r",
      "g",
      "g",
      "g",
      "a",
      "a",
      "p",
    ];

    const gems = {
      d: { name: "diamond", singular: "diamond", plural: "diamonds" },
      r: { name: "ruby", singular: "ruby", plural: "rubies" },
      g: { name: "jade", singular: "jade", plural: "jades" },
      a: { name: "amethyst", singular: "amethyst", plural: "amethysts" },
      p: {
        name: "precious",
        singular: "precious gem",
        plural: "precious gems",
      },
    };

    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];

    console.log(itemLevel);
    if (randint(0, 100) > 90) Amount = parseInt(randint(3, 5)) + itemLevel;
    else Amount = parseInt(randint(1, 2)) + itemLevel;

    if (response == "missed") {
      return util.success({
        msg: message,
        title: `${message.member.displayName} didn't find any gems..`,
        description: `You went mining... but didn't find any gems.`,
      });
    }

    let gemName =
      Amount > 1
        ? gems[response]["plural"]
        : `a(n) ${gems[response]["singular"]}`;

    const title = `${message.member.displayName} mined ${gemName}!`;

    gemName =
      Amount > 1 ? gems[response]["plural"] : gems[response]["singular"];

    util.success({
      msg: message,
      title: title,
      description: `You went mining... and came back with **${Amount}** ${gemName}!\nUse \`${prefix}sell ${
        gems[response]["name"]
      } ${Amount}\` to sell the mined ${Amount > 1 ? "gems" : "gem"}.`,
    });

    const findItem = data.items.find(
      (i) => i.name.toLowerCase() === gems[response]["name"]
    );

    let userInv = data.items.filter(
      (i) => i.name.toLowerCase() !== gems[response]["name"]
    );

    const item = bot.economy.getItem(gems[response]["name"]);
    //console.log(item)

    if (findItem) {
      userInv.push({
        name: item.name,
        amount: findItem.amount + Amount,
        description: item.description,
      });

      data.items = userInv;
      await data.save();
    } else {
      userInv.push({
        name: item.name,
        amount: Amount,
        description: item.description,
      });
      data.items = userInv;
      await data.save();
    }
  }
};

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
