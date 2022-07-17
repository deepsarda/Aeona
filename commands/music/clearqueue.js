const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clearqueue",
  aliases: ["cq"],
  category: "music",
  description: "Clear Queue",
  requiredArgs: 0,
  usage: "+clearqueue <Number of song in queue>",
  permission: [],
  dj: true,

  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      return message.reply({ description: `There is no music playing.` });
    }

    player.queue.clear();

    const emojieject = message.client.emoji.remove;

    return message.reply({
      description: `${emojieject} Removed all songs from the queue`,
    });
  },
};
