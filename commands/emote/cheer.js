const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "cheer",
  description: "cheer for someone!",
  usage: "+cheer [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("cheer");

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
      title: `${author.displayName} just cheered for ${member.displayName}! Hip Hip Hooray! ✺◟(＾∇＾)◞✺`,
      imageURL: res,
    });
  },
};
