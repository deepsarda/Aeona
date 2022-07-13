const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "faceplam",
  description: "Face plam at thier stupidity!",
  usage: "+faceplam",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("faceplam");

    await message.reply({
      title: `${message.member.displayName} is faceplamming! ARGH you are so stupid! (ノ_<。)`,
      imageURL: res,
    });
  },
};
