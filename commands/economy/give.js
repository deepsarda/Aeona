const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "give",
      description: "Give a user some money",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot,prefix='+' ) {
    let util = new Utils(message, this);

    var user = message.member;
    var user2 = 
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
    var profile = await bot.economy.getConfig(user);
    var amount = args[1];
    if(!amount) amount=1000;
    if (typeof amount == "string") {
      if (amount.toLowerCase() == "max" || amount.toLowerCase() == "all") {
        amount = profile.money.wallet;
      }
    }

    if (amount > profile.money.wallet) {
      util.error({
        msg: message,
        title: "You don't have enough money.",
        description: `You need ${(
          amount - profile.money.wallet
        ).toLocaleString()} more credits.`,
      });
      return;
    }

    if (profile.passive) {
      util.error({
        msg: message,
        title: "You can't use this command while passive.",
      });
      return;
    }

    var profile2 = await bot.economy.getConfig(user2);
    
    profile.money.wallet -= amount;
    profile2.money.wallet += amount;

    await profile2.save();
    await profile.save();

    util.success({
      msg: message,
      title: "Give",
      description: `You gave ${amount.toLocaleString()} credits to ${user2.user.tag}.`,
    });
  }
};
