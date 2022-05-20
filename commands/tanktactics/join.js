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
      //Check if the channel is a thread
      if (message.channel.isThread()) {
        let g = getPublicGame(message.channel.id);
        message.client.tankTacticsHandler.join(g, message.member, message);

        message.channel.send(
          `${message.member} **NOTE ALL MESSAGES SENT HERE WILL BE SENT TO ALL PLAYERS IN THE GAME!**`
        );
      } else {
        return message.channel.send(
          "There is no game running currently! \n Use `+create ` to make one or use **+join in a thread to join a public game. (recommended for faster times)**"
        );
      }
    }

    await message.client.tankTacticsHandler.join(game, message.author, message);
  }
};
