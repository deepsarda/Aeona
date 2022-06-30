const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "coinflip",
  description: "Flip a coin, and win double the money or lose all of it!",
  usage: "+coinflip",
  category: "economy",
  requiredArgs: 0,
  cooldown: 10 * 60,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    var user = message.member;
    var profile = await bot.economy.getConfig(user);

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

    if (!foundItem)
      return await message.replyError({
        msg: message,
        title: "You don't have any coins!",
      });

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
      var amount = profile.coinsInWallet;

      message.reply({
        msg: message,
        userp: user,
        title: `${user.displayName} won ${amount.toLocaleString()} credits!`,
        description: `You now have ${(
          profile.coinsInWallet + amount
        ).toLocaleString()} credits.`,
      });
      bot.economy.giveUserCredits(user, amount);
    } else {
      var amount = Math.floor(profile.coinsInWallet * 1);
      message.reply({
        msg: message,
        userp: user,
        title: `${user.displayName} lost ${amount.toLocaleString()} credits!`,
        description: `You now have ${(
          profile.coinsInWallet - amount
        ).toLocaleString()} credits.`,
      });
      bot.economy.takeUserCredits(user, amount);
    }
  },
};
