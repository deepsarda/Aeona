
const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "bored",
  description: "Show your boredom!",
  usage: "+bored",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("bored");

    await message.reply({
      title: `${message.member} is bored! (｡◕‿◕｡)`,
      imageURL: res,
    });
  },
};
