

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "hug",
  description: "Hug someone!",
  usage: "+hug [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("hug");

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
      title: `${author.displayName} just hugged ${member.displayName}!`,
      imageURL: res,
      content: author.id === bot.user.id ? "" : member,
    });
  },
};
