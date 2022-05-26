const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "lumber",
      description: "Chop Wood",
      category: "economy",
      cooldown: 1,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    var data = await bot.economy.getConfig(message.member);
    let founditem = data.items.find((x) => x.name.toLowerCase() === "axe");

    if (!founditem) {
      return util.error({
        msg: message,
        title: "Oops!",
        description: `You don't own an axe yet!\nUse \`${prefix}buy axe\` to buy one, before using this command.`,
      });
    }
    let itemLevel = founditem.level;
    if (!itemLevel) {
      itemLevel = 0;
    }
    

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
      Amount > 1
        ? logs[response]["plural"]
        : `a(n) ${logs[response]["singular"]}`;

    const title = `${message.member.displayName} lumbered ${logName}!`;

    logName =
      Amount > 1 ? logs[response]["plural"] : logs[response]["singular"];

    util.success({
      msg: message,
      title: title,
      description: `You went lumbering... and came back with **${Amount}** ${logName}!\nUse \`${prefix}sell ${
        logs[response]["name"]
      } ${Amount}\` to sell the lumbered ${Amount > 1 ? "logs" : "log"}.`,
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
        amount:Amount,
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
