const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "cuddle",
  description: "Cuddle with someone!",
  usage: "+cuddle [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("cuddle");

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
      title: `${author.displayName} is cuddling ${member.displayName}! Nighty Night, love birds. (ᴗ˳ᴗ)zzZ`,
      imageURL: res,
    });
  },
};
