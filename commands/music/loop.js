const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "loop",
      aliases: ["repeat"],
      description: "Loop the current song.",
      category: "Music",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    if (!message.client.musicManager.get(message.guild.id))
      return message.channel.send("🚫 No music is being played!");
    if (!message.member.voice?.channelId)
      return message.channel.send("🚫 You need to be in my voice channel!");
    if (
      message.member.voice.channelId !==
      message.client.musicManager.get(message.guild.id).voiceChannel
    )
      return message.channel.send("🚫 You're not in the same voice channel!");
    const input = args[0].toLowerCase();
    const type = input === "queue" ? "queue" : "track";
    const response = toggleLoop(message, type);
    message.reply(response);
  }
};
function toggleLoop({ client, guildId }, type) {
  const player = client.musicManager.get(guildId);

  // track
  if (type === "track") {
    player.setTrackRepeat(!player.trackRepeat);
    return `Track loop ${player.trackRepeat ? "enabled" : "disabled"}`;
  }

  // queue
  else if (type === "queue") {
    player.setQueueRepeat(!player.queueRepeat);
    return `Queue loop ${player.queueRepeat ? "enabled" : "disabled"}`;
  }
}
