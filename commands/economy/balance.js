const Discord = require("discord.js");

module.exports = {
  name: "balance",
  description: "View your balance",
  usage: "+balance [user](optional)",
  category: "economy",
  requiredArgs: 0,
  aliases: ["bal", "money"],
  execute: async (message, args, bot, prefix) => {
    const user =
      message.mentions.members.first() &&
      message.mentions.members.filter(
        (m) => args[0] && args[0].includes(m.user.id)
      ).size >= 1
        ? message.mentions.members
            .filter((m) => args[0] && args[0].includes(m.user.id))
            .first()
        : false ||
          message.guild.members.cache.get(args[0]) ||
          (args.length > 0 &&
            message.guild.members.cache.find((m) =>
              m.user.username
                .toLowerCase()
                .includes(args.join(" ").toLowerCase())
            )) ||
          message.member;

    let profile = await bot.economy.getConfig(user);
    message.reply({
      msg: message,
      userp: user,
      title: `${user.displayName}'s balance`,
      description: ` \n **Wallet** \n   ${profile.coinsInWallet.toLocaleString()} \n \n**Bank** \n  ${profile.coinsInBank.toLocaleString()}/${profile.bankSpace.toLocaleString()}   \n \n **Worth** \n   ${(
        profile.coinsInWallet + profile.coinsInBank
      ).toLocaleString()}`,
    });
  },
};
