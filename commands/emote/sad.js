const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "sad",
  description: "Show your sadness!",
  usage: "+sad",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("sad");

    await message.reply({
      title: `${message.member.displayName} is very sad! <(＿　＿)>`,
      imageURL: res,
    });
  },
};
