const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "profile",
      aliases: ["stats","stat"],
      description: "See yours or someones stat",
      category: "economy",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    
  }
};
