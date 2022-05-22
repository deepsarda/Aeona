const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "balance",
      aliases: ["bal", "money", "cash"],
      description: "Check your balance.",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);
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
    util.success({
      msg: message,
      userp: user,
      title: `${user.displayName}'s balance`,
      description: ` \n **Wallet** \n   ${profile.money.wallet.toLocaleString()} \n \n**Bank** \n  ${profile.money.bank.toLocaleString()}/${profile.money.maxBank.toLocaleString()}   \n \n **Worth** \n   ${(
        profile.money.wallet + profile.money.bank
      ).toLocaleString()}`,
    });
  }
};
