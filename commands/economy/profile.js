const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "profile",
      aliases: ["stats", "stat"],
      description: "See yours or someones stat",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
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
      .addField("Wallet", user.money.wallet.toLocaleString() + "₪")
      .addField(
        `Bank`,
        user.money.bank.toLocaleString() +
          "/" +
          user.money.maxBank.toLocaleString() +
          `₪`
      )
      .addField(`Tank Tactics`, "_ _ Stats for Tank Tactics")
      .addField(`Games Played`, user.gameplayed + "_ _", true)
      .addField("Wins", user.wins + "_ _", true)
      .addField("Kills", user.kills + "_ _", true)
      .addField("Deaths", user.deaths + "_ _", true)
      .addField("Moves", user.moves + "_ _", true)
      .addField("Donations", user.donations + "_ _", true)
      .addField("Heals", user.heals + "_ _", true);

    await message.reply({ embeds: [embed] });
  }
};
