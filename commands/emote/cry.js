const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "cry",
  description: "Show your sadness!",
  usage: "+cry",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("cry");

    await message.reply({
      title: `${message.member.displayName} is crying! 〒▽〒ﾞ`,
      imageURL: res,
    });
  },
};
