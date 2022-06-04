const Discord = require("discord.js");
const numberparse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "passive",
  description: "toggle passive mode",
  category: "economy",
  usage: "+passive",
  requiredArgs: 0,
  aliases: [],
  cooldown: 10 * 60,
  execute: async (message, args, bot, prefix) => {
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (profile.passive) {
      profile.passive = false;
      message.reply({
        msg: message,
        title: "You are no longer passive.",
      });
    } else {
      profile.passive = true;
      message.reply({
        msg: message,
        title: "You are now passive.",
      });
    }
    await profile.save();
  },
};
