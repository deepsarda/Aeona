const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "pause",
      aliases: ["stop"],
      description: "Pause the current song.",
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

    const response = pause(message);
    message.reply(response);
  }
};
function pause({ client, guildId }) {
  const player = client.musicManager.get(guildId);
  if (player.paused) return "The player is already paused.";

  player.pause(true);
  return "⏸️ Paused the music player.";
}
