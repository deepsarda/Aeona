const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leave",
  aliases: ["dc"],
  category: "music",
  description: "Leave voice channel",
  requiredArgs: 0,
  usage: "+leave",
  permission: [],

  dj: true,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    const emojiLeave = message.client.emoji.leave;

    player.destroy();

    let thing = new MessageEmbed()
      .setColor(message.client.embedColor)
      .setDescription(
        `${emojiLeave} **Leave the voice channel**\nThank you for using ${message.client.user.username}!`
      );
    return message.reply({ embeds: [thing] });
  },
};
