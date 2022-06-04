const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "daily",
  description: "Get your daily credits",
  usage: "+daily",
  category: "economy",
  requiredArgs: 0,
  cooldown: 10 * 60,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (Date.parse(profile.dailyStreak) + 86400000 > Date.now()) {
      message.replyError({
        msg: message,
        title: "You already got your daily reward.",
        description: `You can get your daily reward again in ${
          (Date.parse(profile.dailyStreak) + 86400000 - Date.now()) /
          1000 /
          60 /
          60
        } hours.`,
      });
      return;
    }
    let amount = 100000;
    profile.dailyStreak = new Date();
    profile.coinsInWallet += amount;
    await profile.save();
    message.reply({
      msg: message,
      title: "Daily reward",
      description: `You got your daily reward of ${amount.toLocaleString()} credits.`,
    });
  },
};
