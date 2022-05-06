const Command = require("../../structures/Command");
const { Message, MessageEmbed, CommandInteraction } = require("discord.js");
const prettyMs = require("pretty-ms");
const { splitBar } = require("string-progressbar");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "np",
      aliases: ["nowplaying", "now-playing"],
      description: "Shows the currently playing song.",
      category: "Music",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    message.reply(nowPlaying(message));
  }
};

function nowPlaying({ client, guildId }) {
  const player = client.musicManager.get(guildId);
  if (!player || !player.queue.current) return "🚫 No music is being played!";

  const track = player.queue.current;
  const end =
    track.duration > 6.048e8
      ? "🔴 LIVE"
      : new Date(track.duration).toISOString().slice(11, 19);

  const embed = new MessageEmbed()
    .setAuthor({ name: "Now playing" })
    .setDescription(`[${track.title}](${track.uri})`)
    .addField(
      "Song Duration",
      "`" + prettyMs(track.duration, { colonNotation: true }) + "`",
      true
    )
    .addField("Added By", track.requester.tag || "NA", true)
    .addField(
      "\u200b",
      new Date(player.position).toISOString().slice(11, 19) +
        " [" +
        splitBar(
          track.duration > 6.048e8 ? player.position : track.duration,
          player.position,
          15
        )[0] +
        "] " +
        end,
      false
    );

  if (typeof track.displayThumbnail === "function")
    embed.setThumbnail(track.displayThumbnail("hqdefault"));

  return { embeds: [embed] };
}
