const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "fish",
      description: "Go fishing.",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);

    //Check if user has fishingrod
    let founditem = profile.items.find(
      (x) => x.name.toLowerCase() === "fishingrod"
    );
    if (!founditem) {
      util.error({
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
      util.error({
        msg: message,
        title: "You missed the fish.",
        description: `You didn't catch anything.`,
      });
      return;
    } else if (random == "junk") {
      util.error({
        msg: message,
        title: `You caught ${amount} junk.`,
        description: `You caught  ${amount} junk. \n Use \`+sell junk ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "junk", amount);
      return;
    } else if (random == "common") {
      util.success({
        msg: message,
        title: `You caught ${amount} common fish.`,
        description: `You caught  ${amount} common fish. \n Use \`+sell common ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "common", amount);
      return;
    } else if (random == "uncommon") {
      util.success({
        msg: message,
        title: `You caught ${amount} uncommon fish.`,
        description: `You caught ${amount} uncommon fish. \n Use \`+sell uncommon ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "uncommon", amount);
      return;
    } else if (random == "rare") {
      util.success({
        msg: message,
        title: `You caught ${amount} rare fish.`,
        description: `You caught  ${amount} rare fish. \n Use \`+sell rare ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "rare", amount);
      return;
    } else if (random == "veryrare") {
      util.success({
        msg: message,
        title: `You caught ${amount} very rare fish.`,
        description: `You caught  ${amount} very rare fish. \n Use \`+sell veryrare ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "veryrare", amount);
      return;
    } else if (random == "legendary") {
      util.success({
        msg: message,
        title: `You caught ${amount} legendary fish.`,
        description: `You caught  ${amount} legendary fish. \n Use \`+sell legendary ${amount}\` to sell it.`,
      });
      bot.economy.giveUserItem(user, "legendary", amount);
      return;
    }
  }
};

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
