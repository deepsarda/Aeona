const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "daily",
      description: "Collect your daily credits",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (Date.parse(profile.dailyStreak) + 86400000 > Date.now()) {
      util.error({
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
    profile.money.wallet += amount;
    await profile.save();
    util.success({
      msg: message,
      title: "Daily reward",
      description: `You got your daily reward of ${amount.toLocaleString()} credits.`,
    });
  }
};
