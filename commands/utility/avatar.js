module.exports = {
  name: "avatar",
  description: "View someone's avatar",
  usage: "+avatar [@member]",
  category: "utility",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const member = message.mentions.members.first() ?? message.member;
    const avatar = member.displayAvatarURL({ dynamic: true });

    await message.reply({
      title: `${member.displayName}'s Avatar`,
      url: avatar,
      imageURL: avatar,
    });
  },
};
