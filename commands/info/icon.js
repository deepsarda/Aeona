module.exports = {
  name: "icon",
  description: "View a server's icon",
  aliases: ["ic"],
  usage: "+icon [serverID]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const server = bot.guilds.cache.get(args[0]) ?? message.guild;

    await message.reply({
      title: `${server.name}'s icon`,
      imageURL: server.iconURL({
        dynamic: true,
        size: 2048,
      }),
      footerText: `Requested by ${message.member.displayName}`,
      footerIconURL: message.member.displayAvatarURL({ dynamic: true }),
    });
  },
};
