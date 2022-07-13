const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "bite",
  description: "Bite someone!",
  usage: "+feed [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("bite");

    const user = parseUser(message, args);

    let author, member;

    if (user.id === message.author.id) {
      author = message.guild.members.cache.get(bot.user.id);
      member = message.member;
    } else {
      author = message.member;
      member = user;
    }

    await message.reply({
      title: `Whoa there, ${author.displayName}! ${member.displayName} just bit you! :punch:`,
      imageURL: res,
    });
  },
};
