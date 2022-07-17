const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "dance",
  description: "Common lets dance!",
  usage: "+dance",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("dance");

    await message.reply({
      title: `${message.member.displayName} is dancing! Lets join the dance! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`,
      imageURL: res,
    });
  },
};
