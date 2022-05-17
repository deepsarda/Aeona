const Discord = require("discord.js");
const Command = require("../../structures/Command");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "join",
      aliases: [],
      usage: "",
      description: "Join a game of Tank Tactics",
      category: "tanktactics",
      cooldown: 3,
    });
  }

  async run(message, args) {
    let game = await message.client.tankTacticsHandler.getGame(
      message.channel.id
    );

    if (!game) {
      return message.channel.send(
        "There is no game running currently! \n Use `+create ` to make one."
      );
    }

    await message.client.tankTacticsHandler.join(game, message.author, message);
  }
};
