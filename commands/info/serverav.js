const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "serverav",
  description: "View someone's server avatar",
  aliases: ["sa", "sav", "serveravatar"],
  usage: "+serverav [@user]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    await message.channel.send({
      title: `${user.displayName}'s avatar`,
      imageURL: user.displayAvatarURL({
        dynamic: true,
        size: 2048,
      }),
      footerText: `Requested by ${message.member.displayName}`,
      footerIconURL: message.member.displayAvatarURL({ dynamic: true }),
    });
  },
};
