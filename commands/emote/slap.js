const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "slap",
  description: "Slap someone!",
  usage: "+slap [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("slap");

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
      title: `${author.displayName} just slapped ${member.displayName}! :raised_hand:`,
      imageURL: res,
    });
  },
};
