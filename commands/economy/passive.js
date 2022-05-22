const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Utils = require("../../structures/Utils");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "passive",
      description: "Toggle your passive.",
      category: "economy",
      cooldown: 60 * 15,
      usage: "",
    });
  }
  async run(message, args, bot) {
    let util = new Utils(message, this);
    let user = message.member;
    let profile = await bot.economy.getConfig(user);
    if (profile.passive) {
      profile.passive = false;
      util.success({
        msg: message,
        title: "You are no longer passive.",
      });
    } else {
      profile.passive = true;
      util.success({
        msg: message,
        title: "You are now passive.",
      });
    }
    await profile.save();
  }
};
