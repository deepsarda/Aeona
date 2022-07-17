const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "high-five",
  description: "high-five someone!",
  usage: "+high-five [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("high five");

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
      title: `${author.displayName} just high-fived ${member.displayName}! o/\\o`,
      imageURL: res,
    });
  },
};
