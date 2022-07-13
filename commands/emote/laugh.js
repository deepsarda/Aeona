const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "laugh",
  description: "laugh",
  usage: "+laugh",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("laugh");

    await message.reply({
      title: `${message.member.displayName} is laughing! :D`,
      imageURL: res,
    });
  },
};
