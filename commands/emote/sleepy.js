const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "sleepy",
  description: "Show your sleepiness!",
  usage: "+sleepy",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("sleepy");

    await message.reply({
      title: `${message.member.displayName} is sleepy! (- o – )zzzZZ`,
      imageURL: res,
    });
  },
};
