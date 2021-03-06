const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  category: "music",
  description: "Shuffle queue",
  requiredArgs: 0,
  usage: "+shuffle",
  permission: [],
  dj: true,

  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return message.reply({ embeds: [thing] });
    }
    player.queue.shuffle();

    const emojishuffle = client.emoji.shuffle;

    let thing = new MessageEmbed()
      .setDescription(`${emojishuffle} Shuffled the queue`)

      .setTimestamp();
    return message
      .reply({ embeds: [thing] })
      .catch((error) => client.error(error));
  },
};
