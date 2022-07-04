const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "banner",
  description: "View someone's banner",
  usage: "+banner [@user]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = parseUser(message, args);
    const user = await member.user.fetch();

    await message.reply({
      title: `${member.displayName}'s banner`,
      imageURL: user.bannerURL({
        dynamic: true,
        size: 2048,
      }),
      footerText: `Requested by ${message.member.displayName}`,
      footerIconURL: message.member.displayAvatarURL({ dynamic: true }),
    });
  },
};
