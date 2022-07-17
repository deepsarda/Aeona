const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "revive",
  description: "Revive someone!",
  usage: "+revive [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await bot.getReaction("revive");

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
      title: `${author.displayName} just reviveded ${member.displayName}! Thank god they are alive! ƪ(˘⌣˘)ʃ`,
      imageURL: res,
    });
  },
};
