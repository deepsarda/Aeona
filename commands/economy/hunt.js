const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "hunt",
  description: "Go use your rifle to hunt for animals",
  usage: "+hunt",
  category: "economy",
  requiredArgs: 0,
  aliases: [],
  cooldown: 10,
  execute: async (message, args, bot, prefix) => {
    let profile = await bot.economy.getConfig(user);
    let data = profile;
    //Check if user has fishingrod
    let founditem = profile.items.find((x) => x.name.toLowerCase() === "rifle");
    if (!founditem) {
      message.replyError({
        msg: message,
        title: "You don't have a rifle.",
        description: `Use \`+buy rifle\` to buy a rifle.`,
      });
      return;
    }

    let level = founditem.level ? founditem.level : 1;
    let amount = randint(1, 5) + level;

    const loot = [
      "chicken",
      "duck",
      "rabbit",
      "fox",
      "pig",
      "deer",
      "boar",
      "cow",
      "bear",
      "missed",
    ];
    const random = loot[Math.floor(Math.random() * loot.length)];

    if (random == "missed") {
      message.replyError({
        msg: message,
        title: "You missed the animal.",
        description: `You didn't catch anything.`,
      });
      return;
    } else if (random == "chicken") {
      message.reply({
        msg: message,
        title: `You caught ${amount} chicken.`,
        description: `You caught ${amount} chicken. Use \`+sell chicken ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "chicken", amount);
    } else if (random == "duck") {
      message.reply({
        msg: message,
        title: `You caught ${amount} duck.`,
        description: `You caught ${amount} duck. Use \`+sell duck ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "duck", amount);
    } else if (random == "rabbit") {
      message.reply({
        msg: message,
        title: `You caught ${amount} rabbit.`,
        description: `You caught ${amount} rabbit. Use \`+sell rabbit ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "rabbit", amount);
    } else if (random == "fox") {
      message.reply({
        msg: message,
        title: `You caught ${amount} fox.`,
        description: `You caught ${amount} fox. Use \`+sell fox ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "fox", amount);
    } else if (random == "pig") {
      message.reply({
        msg: message,
        title: `You caught ${amount} pig.`,
        description: `You caught ${amount} pig. Use \`+sell pig ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "pig", amount);
    } else if (random == "deer") {
      message.reply({
        msg: message,
        title: `You caught ${amount} deer.`,
        description: `You caught ${amount} deer. Use \`+sell deer ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "deer", amount);
    } else if (random == "boar") {
      message.reply({
        msg: message,
        title: `You caught ${amount} boar.`,
        description: `You caught ${amount} boar. Use \`+sell boar ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "boar", amount);
    } else if (random == "cow") {
      message.reply({
        msg: message,
        title: `You caught ${amount} cow.`,
        description: `You caught ${amount} cow. Use \`+sell cow ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "cow", amount);
    } else if (random == "bear") {
      message.reply({
        msg: message,
        title: `You caught ${amount} bear.`,
        description: `You caught ${amount} bear. Use \`+sell bear ${amount}\` to sell them.`,
      });

      bot.economy.giveUserItem(user, "bear", amount);
    }
  },
};
