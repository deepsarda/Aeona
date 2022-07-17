const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "fish",
  description: "Go fishing",
  usage: "+fish",
  category: "economy",
  requiredArgs: 0,
  aliases: [],
  cooldown: 10,
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    //Check if user has fishingrod
    let founditem = profile.items.find(
      (x) => x.name.toLowerCase() === "fishingrod"
    );

    if (!founditem)
      return await message.replyError({
        msg: message,
        title: "Oops!",
        description: `You don't own a fishing rod yet!\nUse \`${prefix}buy fishingrod\` to buy one, before using this command.`,
      });

    const fishingURL =
      "https://img.icons8.com/external-photo3ideastudio-lineal-color-photo3ideastudio/344/external-fishing-winter-photo3ideastudio-lineal-color-photo3ideastudio.png";

    let level = founditem.level ? founditem.level : 1;
    // let level = 1;

    const lootTable = [
      0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4,
      5, 5, 6,
    ];

    const loot = [
      "junk",
      "common",
      "uncommon",
      "rare",
      "veryrare",
      "legendary",
      "missed",
    ];

    const random =
      loot[lootTable[Math.floor(Math.random() * lootTable.length)]];
    let amount = randint(1, 5) + level;

    if (random == "missed")
      return await message.replyError({
        msg: message,
        title: "Oops, the rod is empty...",
        description: "You didn't catch anything!",
        thumbnailURL: fishingURL,
      });
    else if (random == "junk") {
      await message.reply({
        msg: message,
        title: "This doesn't look like fish...",
        description: `You caught ${amount} ${
          amount > 1 ? "Pieces of Junk" : "Piece of Junk"
        }\n\nUse \`${prefix}sell junk ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "junk", amount);
    } else if (random == "common") {
      await message.reply({
        msg: message,
        title: `You caught ${amount} ${
          amount > 1 ? "Common Fishes" : "Commmon Fish"
        }!`,
        description: `You caught ${amount}${
          amount > 1 ? "Common Fishes" : "Commmon Fish"
        }!\n\nUse \`+sell common ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "common", amount);
    } else if (random == "uncommon") {
      await message.reply({
        msg: message,
        title: `You caught ${amount} ${
          amount > 1 ? "Uncommon Fishes" : "Uncommmon Fish"
        }!`,
        description: `You caught ${amount} ${
          amount > 1 ? "Uncommon Fishes" : "Uncommmon Fish"
        }!\n\nUse \`${prefix}sell uncommon ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "uncommon", amount);
    } else if (random == "rare") {
      await message.reply({
        msg: message,
        title: `You caught ${amount} ${
          amount > 1 ? "Rare Fishes" : "Rare Fish"
        }!`,
        description: `You caught ${amount} ${
          amount > 1 ? "Rare Fishes" : "Rare Fish"
        }!\n\nUse \`${prefix}sell rare ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "rare", amount);
    } else if (random == "veryrare") {
      await message.reply({
        msg: message,
        title: `You caught ${amount} ${
          amount > 1 ? "Very Rare Fishes" : "Very Rare Fish"
        }!`,
        description: `You caught ${amount} ${
          amount > 1 ? "Very Rare Fishes" : "Very Rare Fish"
        }!\n\nUse \`${prefix}sell veryrare ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "veryrare", amount);
    } else if (random == "legendary") {
      await message.reply({
        msg: message,
        title: `You caught ${amount} ${
          amount > 1 ? "Legendary Fishes" : "Legendary Fish"
        }!`,
        description: `You caught ${amount} ${
          amount > 1 ? "Legendary Fishes" : "Legendary Fish"
        }!\n\nUse \`${prefix}sell legendary ${amount}\` to sell your catch.`,
        thumbnailURL: fishingURL,
      });
      return bot.economy.giveUserItem(user, "legendary", amount);
    }
  },
};
