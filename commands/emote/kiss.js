const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "kiss",
  description: "Kiss someone!",
  usage: "+kiss [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("kiss");

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
      title: `So sweet <3. ${author.displayName} just kissed ${member.displayName}!`,
      imageURL: res,
    });
  },
};
