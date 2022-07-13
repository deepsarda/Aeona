const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "smug",
  description: "Show your smugness!",
  usage: "+smug",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("smug");

    await message.reply({
      title: `${message.member.displayName} is very smug!`,
      imageURL: res,
    });
  },
};
