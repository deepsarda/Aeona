const Command = require("../../structures/Command");
const { Message, MessageEmbed, CommandInteraction } = require("discord.js");
const prettyMs = require("pretty-ms");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "play",
      aliases: ["p"],
      description: "Play a song or playlist.",
      category: "Music",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    const response = await play(message, message.author, args.join(" "));
    message.reply(response);
  }
};

async function play({ member, guild, channel }, user, query) {
  if (!query) return "🚫 You need to provide a query!";
  if (!member.voice.channel) return "🚫 You need to join a voice channel first";
  let player = guild.client.musicManager.get(guild.id);

  if (player && member.voice.channel !== guild.me.voice.channel) {
    return "🚫 You must be in the same voice channel as mine";
  }

  try {
    player = guild.client.musicManager.create({
      guild: guild.id,
      textChannel: channel.id,
      voiceChannel: member.voice.channel.id,
      volume: 50,
    });
  } catch (ex) {
    if (ex.message === "No available nodes.") {
      guild.client.logger.debug("No available nodes!");
      return "🚫 No available nodes! Try again later";
    }
  }

  if (player.state !== "CONNECTED") player.connect();
  let res;

  try {
    res = await player.search(query, user);
    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();
      throw res.exception;
    }
  } catch (err) {
    console.log("Search Exception", err);
    return "There was an error while searching";
  }

  let embed = new MessageEmbed();
  let track;

  switch (res.loadType) {
    case "NO_MATCHES":
      if (!player.queue.current) player.destroy();
      return `No results found matching ${query}`;

    case "TRACK_LOADED":
      track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
        return "> 🎶 Adding song to queue";
      }

      embed
        .setAuthor({ name: "Added Song to queue" })
        .setDescription(`[${track.title}](${track.uri})`)
        .addField(
          "Song Duration",
          "`" + prettyMs(track.duration, { colonNotation: true }) + "`",
          true
        )
        .setFooter({ text: `Requested By: ${track.requester.tag}` });

      if (typeof track.displayThumbnail === "function")
        embed.setThumbnail(track.displayThumbnail("hqdefault"));
      if (player.queue.totalSize > 0)
        embed.addField(
          "Position in Queue",
          (player.queue.size - 0).toString(),
          true
        );
      return { embeds: [embed] };

    case "PLAYLIST_LOADED":
      player.queue.add(res.tracks);
      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      ) {
        player.play();
      }

      embed
        .setAuthor({ name: "Added Playlist to queue" })
        .setDescription(res.playlist.name)
        .addField("Enqueued", `${res.tracks.length} songs`, true)
        .addField(
          "Playlist duration",
          "`" + prettyMs(res.playlist.duration, { colonNotation: true }) + "`",
          true
        )
        .setFooter({ text: `Requested By: ${res.tracks[0].requester.tag}` });

      return { embeds: [embed] };

    case "SEARCH_RESULT":
      track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
        return "> 🎶 Adding song to queue";
      }

      embed
        .setAuthor({ name: "Added Song to queue" })
        .setDescription(`[${track.title}](${track.uri})`)
        .addField(
          "Song Duration",
          "`" + prettyMs(track.duration, { colonNotation: true }) + "`",
          true
        )
        .setFooter({ text: `Requested By: ${track.requester.tag}` });

      if (player.queue.totalSize > 0)
        embed.addField(
          "Position in Queue",
          (player.queue.size - 0).toString(),
          true
        );
      return { embeds: [embed] };
  }
}
