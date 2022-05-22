const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "coinflip",
      description:
        "Flip a coin, If you win gain double the money or lose all the money.",
      category: "economy",
      cooldown: 60 * 10,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);

    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    const coins = [
      "bronzecoin",
      "silvercoin",
      "goldcoin",
      "diamondcoin",
      "rainbowcoin",
    ];

    const foundItem = profile.items.find((i) =>
      coins.includes(i.name.toLowerCase())
    );

    if (!foundItem) {
      util.error({
        msg: message,
        title: "You don't have any coins.",
      });
      return;
    }

    const rand = randint(0, 100);

    const winAmount = profile.items.find(
      (i) => i.name.toLowerCase() === "diamondcoin"
    )
      ? 75
      : profile.items.find((i) => i.name.toLowerCase() === "rainbowcoin")
      ? 50
      : profile.items.find((i) => i.name.toLowerCase() === "goldcoin")
      ? 35
      : profile.items.find((i) => i.name.toLowerCase() === "silvercoin")
      ? 25
      : profile.items.find((i) => i.name.toLowerCase() === "bronzecoin")
      ? 10
      : 0;

    if (rand < winAmount) {
      let amount = profile.money.wallet;

      util.success({
        msg: message,
        userp: user,
        title: `${user.displayName} won ${amount.toLocaleString()} credits!`,
        description: `You now have ${(
          profile.money.wallet + amount
        ).toLocaleString()} credits.`,
      });
      bot.economy.giveUserCredits(user, amount);
    } else {
      let amount = Math.floor(profile.money.wallet * 1);
      util.success({
        msg: message,
        userp: user,
        title: `${user.displayName} lost ${amount.toLocaleString()} credits!`,
        description: `You now have ${(
          profile.money.wallet - amount
        ).toLocaleString()} credits.`,
      });
      bot.economy.takeUserCredits(user, amount);
    }
  }
};
