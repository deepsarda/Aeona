const Discord = require("discord.js");
const Command = require("../../structures/Command");
const ttt = require("../../packages/tictactoe");
const tttInstance = new ttt();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "tictactoe",
      aliases: ["ttt"],
      usage: "",
      description: "Play tictactoe with the bot or your friends!",
      category: "game",
      cooldown: 3,
    });
  }

  async run(message, args) {
    let user2 = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.guild.members.cache.get(args[0])
      ? message.guild.members.cache.get(args[0])
      : null;

    if (!user2) {
      message.channel.send(
        `<@${message.author.id}>, you can play with other users by mentioning them while running the command! \n **Right now you are playing with the bot!**`
      );
      tttInstance.solo(message, message.client);
    } else {
      tttInstance.duo(message, user2);
    }
  }
};
