const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "bully",
  description: "Bully someone!",
  usage: "+bully [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("bully");

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
      title: `${author.displayName} just bullied ${member.displayName}! That's not very nice! (￣_￣|||)`,
      imageURL: res,
    });
  },
};
