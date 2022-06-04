const Discord = require("discord.js");
const numberParse = require("../../utils/numberParse");
const randint = require("../../utils/randint");
module.exports = {
  name: "profile",
  description: "View your profile.",
  category: "economy",
  usage: "+profile [user](optional)",
  requiredArgs: 0,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const mentionUser =
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

    let user = await message.client.economy.getUser(mentionUser.id);

    let embed = new Discord.MessageEmbed()
      .setTitle(`${mentionUser.username}\'s Profile`)
      .setThumbnail(mentionUser.displayAvatarURL({ dynamic: true }))
      .addField("Wallet", user.coinsInWallet.toLocaleString() + "₪")
      .addField(
        `Bank`,
        user.coinsInBank.toLocaleString() +
          "/" +
          user.bankSpace.toLocaleString() +
          `₪`
      );

    await message.reply({ embeds: [embed] });
  },
};
