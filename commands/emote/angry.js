const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "angry",
  description: "Show your anger!",
  usage: "+angry",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("angry");

    await message.reply({
      title: `My my, ${message.member.displayName} is angry! (╬▔皿▔)╯`,
      imageURL: res,
    });
  },
};
