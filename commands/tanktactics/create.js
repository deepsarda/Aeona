const Discord = require("discord.js");
const Command = require("../../structures/Command");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "create",
      aliases: [],
      usage: "",
      description: "Create a game of Tank Tactics",
      category: "tanktactics",
      cooldown: 3,
    });
  }

  async run(message, args) {
    let game = await message.client.tankTacticsHandler.getGame(
      message.channel.id
    );

    if (game) {
      return message.channel.send("There is already a game in this channel!");
    }

    game = await message.client.tankTacticsHandler.createGame(
      message.channel.id
    );

    await message.client.tankTacticsHandler.join(game, message.author, message);
  }
};
