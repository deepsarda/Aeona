const { MessageEmbed } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { progressbar } = require("../../utils/progressbar.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "music",
  description: "Show now playing song",
  requiredArgs: 0,
  usage: "+nowplaying",
  permission: [],

  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return message.channel.send(thing);
    }
    const song = player.queue.current;
    var total = song.duration;
    var current = player.position;

    let embed = new MessageEmbed()
      .setDescription(
        `**Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(
          song.duration
        )}]\`- [${song.requester}] \n\n\`${progressbar(player)}\``
      )
      .setThumbnail(song.displayThumbnail("3"))

      .addField(
        "\u200b",
        `\`${convertTime(current)} / ${convertTime(total)}\``
      );
    return message.channel.send({ embeds: [embed] });
  },
};
