const client = require('nekos.life');
const neko = new client();

const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "feed",
  description: "Feed someone!",
  usage: "+feed [@user]",
  category: "emote",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    res = await neko.feed();
    res = res["url"];

    const user = parseUser(message, args);

    let author, member;

    if (user.id === message.author.id) {
      author = message.guild.members.cache.get(bot.user.id);
      member = message.member;
    }
    else {
      author = message.member;
      member = user;
    }

    await message.channel.send({
      title: `${author.displayName} just fed ${member.displayName}!`,
      imageURL: res,
      content: author.id === bot.user.id ? "" : member
    });
  },
};
