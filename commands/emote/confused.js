const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "confused",
  description: "Show your confusion!",
  usage: "+confused",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("confused");

    await message.reply({
      title: `${message.member.displayName} is confused! 「(°ヘ°)`,
      imageURL: res,
    });
  },
};
