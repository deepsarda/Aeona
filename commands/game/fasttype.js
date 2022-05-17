const Discord = require("discord.js");
const Command = require("../../structures/Command");
const reflex = require("discord-reflex-speed");
const game = new reflex();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "fasttype",
      aliases: [],
      usage: "",
      description: "See who can type the fastest!",
      category: "game",
      cooldown: 3,
    });
  }

  async run(message, args) {
    game.party(message);
  }
};
