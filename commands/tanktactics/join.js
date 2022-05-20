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
        game = await message.client.tankTacticsHandler.getPublicGame(
          message.channel.id
        );


        await message.channel.send(
          `${message.member} **NOTE ALL MESSAGES SENT HERE WILL BE SENT TO ALL PLAYERS IN THE GAME!**`
        );

        return;
      } else {
        return message.channel.send(
          "There is no game running currently! \n Use `+create ` to make one or use **+join in a thread to join a public game. (recommended for faster times)**"
        );
      }
    }

    await message.client.tankTacticsHandler.join(game, message.author, message);
  }
};
