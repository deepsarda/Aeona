const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "blush",
  description: "Show your blushing!",
  usage: "+blush",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("blush");

    await message.reply({
      title: `Aha ha ha, ${message.member.displayName} is blushing! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`,
      imageURL: res,
    });
  },
};
