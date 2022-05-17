const Discord = require("discord.js");
const Command = require("../../structures/Command");
const click = require("discord-click-speed");
const game = new click();
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "cps",
      aliases: [],
      usage: "",
      description: "See who can click the button the  fastest!",
      category: "game",
      cooldown: 3,
    });
  }

  async run(message, args) {
    game.party(message);
  }
};
