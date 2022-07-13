const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "chase",
  description: "chase someone!",
  usage: "+chase [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("chase");

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
      title: `${author.displayName} is chasing ${member.displayName}! They better run like the wind. ☁ ✧༺`,
      imageURL: res,
    });
  },
};
