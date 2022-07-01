const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
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
    const user = message.author;

    let profile = await bot.economy.getConfig(user);
    let data = profile;
    //Check if user has fishingrod
    let founditem = profile.items.find((x) => x.name.toLowerCase() === "rifle");

    if (!founditem) {
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description: `You don't own an rifle yet!\nUse \`${prefix}buy rifle\` to buy one, before using this command.`,
      });
    }

    const huntingURL = "https://img.icons8.com/color/344/duck-hunt.png";

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
      await message.replyError({
        title: "Oops, the animal fled...",
        description: `You didn't hunt anything!`,
        thumbnailURL: huntingURL,
      });
      return;
    } else if (random == "chicken") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Chickens" : "Chicken"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Chickens" : "Chicken"
        }.\n\nUse \`${prefix}sell chicken ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "chicken", amount);
    } else if (random == "duck") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Ducks" : "Duck"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Ducks" : "Duck"
        }.\n\nUse \`${prefix}sell duck ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "duck", amount);
    } else if (random == "rabbit") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Rabbits" : "Rabbit"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Rabbits" : "Rabbit"
        }.\n\nUse \`${prefix}sell rabbit ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "rabbit", amount);
    } else if (random == "fox") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Foxes" : "Fox"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Foxes" : "Fox"
        }.\n\nUse \`${prefix}sell fox ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "fox", amount);
    } else if (random == "pig") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Pigs" : "Pig"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Pigs" : "Pig"
        }.\n\nUse \`${prefix}sell pig ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "pig", amount);
    } else if (random == "deer") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Deer" : "Deer"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Deer" : "Deer"
        }.\n\nUse \`${prefix}sell deer ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "deer", amount);
    } else if (random == "boar") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Boars" : "Boar"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Boars" : "Boar"
        }.\n\nUse \`${prefix}sell boar ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "boar", amount);
    } else if (random == "cow") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Cows" : "Cow"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Cows" : "Cow"
        }.\n\nUse \`${prefix}sell cow ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "cow", amount);
    } else if (random == "bear") {
      await message.reply({
        title: `You hunted ${amount} ${amount > 1 ? "Bears" : "Bear"}.`,
        description: `You hunted ${amount} ${
          amount > 1 ? "Bears" : "Bear"
        }.\n\nUse \`${prefix}sell bear ${amount}\` to sell your hunt.`,
        thumbnailURL: huntingURL,
      });

      bot.economy.giveUserItem(user, "bear", amount);
    }
  },
};
