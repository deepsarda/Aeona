const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "feed",
  description: "Feed someone!",
  usage: "+feed [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("feed");

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
      title: `Yum! ${author.displayName} just fed ${member.displayName}! 🍔`,
      imageURL: res,
    });
  },
};
