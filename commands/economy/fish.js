const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
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
    if (!founditem) {
      message.replyError({
        msg: message,
        title: "You don't have a fishing rod.",
        description: `Use \`+buy fishingrod\` to buy a fishing rod.`,
      });
      return;
    }

    let level = founditem.level ? founditem.level : 1;

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

    if (random == "missed") {
      message.replyError({
        msg: message,
        title: "You missed the fish.",
        description: `You didn't catch anything.`,
      });
      return;
    } else if (random == "junk") {
      message.replyError({
        msg: message,
        title: `You caught ${amount} junk.`,
        description: `You caught  ${amount} junk. \n Use \`+sell junk ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "junk", amount);
      return;
    } else if (random == "common") {
      message.reply({
        msg: message,
        title: `You caught ${amount} common fish.`,
        description: `You caught  ${amount} common fish. \n Use \`+sell common ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "common", amount);
      return;
    } else if (random == "uncommon") {
      message.reply({
        msg: message,
        title: `You caught ${amount} uncommon fish.`,
        description: `You caught ${amount} uncommon fish. \n Use \`+sell uncommon ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "uncommon", amount);
      return;
    } else if (random == "rare") {
      message.reply({
        msg: message,
        title: `You caught ${amount} rare fish.`,
        description: `You caught  ${amount} rare fish. \n Use \`+sell rare ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "rare", amount);
      return;
    } else if (random == "veryrare") {
      message.reply({
        msg: message,
        title: `You caught ${amount} very rare fish.`,
        description: `You caught  ${amount} very rare fish. \n Use \`+sell veryrare ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "veryrare", amount);
      return;
    } else if (random == "legendary") {
      message.reply({
        msg: message,
        title: `You caught ${amount} legendary fish.`,
        description: `You caught  ${amount} legendary fish. \n Use \`+sell legendary ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "legendary", amount);
      return;
    }
  },
};
