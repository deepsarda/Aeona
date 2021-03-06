const { MessageEmbed } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const ms = require("ms");

module.exports = {
  name: "seek",
  aliases: [],
  category: "music",
  description: "Seek the currently playing song",
  requiredArgs: 1,
  usage: "+seek <10s || 10m || 10h>",
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

    const time = ms(args[0]);
    const position = player.position;
    const duration = player.queue.current.duration;

    const song = player.queue.current;

    if (time <= duration) {
      if (time > position) {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            ` **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(
              time
            )} / ${convertTime(duration)}\``
          )

          .setTimestamp();
        return message.reply({ embeds: [thing] });
      } else {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            `**Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(
              time
            )} / ${convertTime(duration)}\``
          )

          .setTimestamp();
        return message.reply({ embeds: [thing] });
      }
    } else {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `Seek duration exceeds Song duration.\nSong duration: \`${convertTime(
            duration
          )}\``
        );
      return message.reply({ embeds: [thing] });
    }
  },
};
