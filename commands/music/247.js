const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "247",
  aliases: ["24h", "24/7", "24*7"],
  category: "music",
  description: "24/7 in voice channel",
  requiredArgs: 0,
  usage: "+247",
  permission: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.players.get(message.guild.id);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      return message.reply({ description: `24/7 mode is now off.` });
    } else {
      player.twentyFourSeven = true;
      return message.reply({ description: `24/7 mode is now on.` });
    }
  },
};
