const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "happy",
  description: "Show your happiness!",
  usage: "+happy ",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("happy");

    await message.reply({
      title: `${author.displayName} is very happy! (❁´◡\`❁)`,
      imageURL: res,
    });
  },
};
