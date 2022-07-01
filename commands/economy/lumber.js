const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "lumber",
  category: "economy",
  description: "Gathers lumber from trees.",
  usage: "+lumber",
  requiredArgs: 0,
  aliases: ["tree", "wood", "tree-cutting", "wood-cutting", "chop"],
  execute: async (message, args, bot, prefix) => {
    let data = await bot.economy.getConfig(message.member);
    let founditem = data.items.find((x) => x.name.toLowerCase() === "axe");

    if (!founditem)
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description: `You don't own an axe yet!\nUse \`${prefix}buy axe\` to buy one, before using this command.`,
      });

    const lumberingURL =
      "https://img.icons8.com/external-color-line-collection-vinzence-studio/344/external-wood-construction-color-line-collection-vinzence-studio.png";

    let itemLevel = founditem.level;
    if (!itemLevel) itemLevel = 0;

    const randomMessage = [
      "o",
      "o",
      "o",
      "o",
      "o",
      "c",
      "c",
      "c",
      "c",
      "f",
      "f",
      "f",
      "e",
      "e",
      "s",
    ];

    const logs = {
      o: { name: "oak", singular: "oak log", plural: "oak logs" },
      c: { name: "palm", singular: "palm log", plural: "palm logs" },
      f: { name: "fir", singular: "fir log", plural: "fir logs" },
      e: { name: "ebony", singular: "ebony log", plural: "ebony logs" },
      s: { name: "maple", singular: "maple log", plural: "maple logs" },
    };

    const response =
      randomMessage[Math.floor(Math.random() * randomMessage.length)];
    let Amount = 0;

    if (randint(0, 100) > 90) Amount = randint(3, 5) + itemLevel;
    else Amount = randint(1, 2) + itemLevel;

    let logName =
      Amount > 1 ? logs[response]["plural"] : logs[response]["singular"];

    logName =
      Amount > 1 ? logs[response]["plural"] : logs[response]["singular"];

    await message.reply({
      msg: message,
      title: `You lumbered ${Amount} ${logName}!`,
      description: `You lumbered ${Amount} ${logName}!\n\nUse \`${prefix}sell ${logs[response]["name"]} ${Amount}\` to sell your wood.`,
      thumbnailURL: lumberingURL,
    });

    const findItem = data.items.find(
      (i) => i.name.toLowerCase() === logs[response]["name"]
    );

    let userInv = data.items.filter(
      (i) => i.name.toLowerCase() !== logs[response]["name"]
    );

    const item = bot.economy.getItem(logs[response]["name"]);

    if (findItem) {
      userInv.push({
        name: item.name,
        amount: parseInt(findItem.amount) + Amount,
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
