const Discord = require("discord.js");
const Command = require("../../structures/Command");
const click = require("discord-clicking-game");
const game = new click();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "click",
      aliases: [],
      usage: "",
      description: "See who can click the fastest!",
      category: "game",
      cooldown: 3,
    });
  }

  async run(message, args) {
    game.party(message);
  }
};
