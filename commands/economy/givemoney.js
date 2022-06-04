const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");

module.exports = {
  name: "givemoney",
  description: "Give money to another user",
  usage: "+givemoney [user] [amount]",
  category: "economy",
  requiredArgs: 2,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    var user = message.member;
    var user2 =
      message.mentions.members.first() &&
      message.mentions.members.filter(
        (m) => args[0] && args[0].includes(m.user.id)
      ).size >= 1
        ? message.mentions.members
            .filter((m) => args[0] && args[0].includes(m.user.id))
            .first()
        : false ||
          message.guild.members.cache.get(args[0]) ||
          (args.length > 0 &&
            message.guild.members.cache.find((m) =>
              m.user.username
                .toLowerCase()
                .includes(args.join(" ").toLowerCase())
            )) ||
          message.member;
    var profile = await bot.economy.getConfig(user);
    var amount = args[1];
    if (!amount) amount = 1000;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        amount = profile.coinsInWallet;
      }
    }
    if (!Number.isFinite(amount) || Number.isNaN(amount) || amount < 1)
      return message.replyError({ msg: message, title: "Invalid amount!" });
    if (amount > profile.coinsInWallet) {
      message.replyError({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.coinsInWallet
        ).toLocaleString()} more credits.`,
      });
      return;
    }

    if (profile.passive) {
      message.replyError({
        msg: message,
        title: "You can't use this command while passive.",
      });
      return;
    }

    var profile2 = await bot.economy.getConfig(user2);

    profile.coinsInWallet -= amount;
    profile2.coinsInWallet += amount;

    await profile2.save();
    await profile.save();

    message.reply({
      msg: message,
      title: "Give",
      description: `You gave ${amount.toLocaleString()} credits to ${
        user2.user.tag
      }.`,
    });
  },
};
