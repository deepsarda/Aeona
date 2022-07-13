const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "tickle",
  description: "Tickle someone!",
  usage: "+tickle [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("tickle");

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
      title: `${author.displayName} just tickled ${member.displayName}! Stop, it tickles! :3`,
      imageURL: res,
    });
  },
};
