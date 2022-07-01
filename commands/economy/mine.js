const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "mine",
  description: "Mine some ores.",
  category: "economy",
  usage: "+mine",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    var data = await bot.economy.getConfig(message.member);
    let founditem = data.items.find((x) => x.name.toLowerCase() === "pickaxe");

    if (!founditem) {
      return message.replyError({
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

    let Amount;
    if (randint(0, 100) > 90) Amount = parseInt(randint(3, 5)) + itemLevel;
    else Amount = parseInt(randint(1, 2)) + itemLevel;

    const miningURL =
      "https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/344/external-mining-cryptocurrency-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-3.png";

    if (response == "missed") {
      return message.reply({
        msg: message,
        title: `${message.member.displayName} didn't find any gems!`,
        description: `You went mining... but didn't find any gems.`,
        thumbnailURL: miningURL,
      });
    }

    let gemName =
      Amount > 1 ? gems[response]["plural"] : gems[response]["singular"];

    gemName =
      Amount > 1 ? gems[response]["plural"] : gems[response]["singular"];

    await message.reply({
      title: `You mined ${Amount} ${gemName}!`,
      description: `You mined ${Amount} ${gemName}!\n\nUse \`${prefix}sell ${gems[response]["name"]} ${Amount}\` to sell your gems.`,
      thumbnailURL: miningURL,
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
  },
};
