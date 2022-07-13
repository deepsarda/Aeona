const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "poke",
  description: "Poke someone!",
  usage: "+poke [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("poke");

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
      title: `${author.displayName} just poked ${member.displayName}! Ouch! 💔`,
      imageURL: res,
    });
  },
};
