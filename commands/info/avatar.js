const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "avatar",
  description: "View someone's avatar",
  aliases: ["av"],
  usage: "+avatar [@user]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    await message.channel.send({
      title: `${user.displayName}'s avatar`,
      imageURL: user.user.avatarURL({
        dynamic: true,
        size: 2048,
      }),
      footerText: `Requested by ${message.member.displayName}`,
      footerIconURL: message.member.displayAvatarURL({ dynamic: true }),
    });
  },
};
