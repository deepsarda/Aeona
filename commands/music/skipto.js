const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skipto",
  aliases: ["jump"],
  category: "music",
  description: "Forward song",
  requiredArgs: 1,
  usage: "+skipto <Number of song in queue>",
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

    const position = Number(args[0]);

    if (!position || position < 0 || position > player.queue.size) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `Usage: ${message.client.prefix}skipto <Number of song in queue>`
        );
      return message.reply({ embeds: [thing] });
    }

    player.queue.remove(0, position - 1);
    player.stop();

    const emojijump = client.emoji.jump;

    let thing = new MessageEmbed()
      .setDescription(`${emojijump} Forward **${position}** Songs`)

      .setTimestamp();

    return message.reply({ embeds: [thing] });
  },
};
